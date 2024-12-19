import logging

from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import (
    LLMDataRegistry,
    LLMDatasetSource,
    LLMExperiment,
    LLMExperimentCheckpoint,
    LLMExperimentResult,
    LLMExperimentSetting,
)
from api.services.utils.azure.fileshare_service import AzureFileShareService
from fastapi import status
from sqlalchemy import desc, insert
from sqlalchemy.orm import selectinload


class LLMExperimentDao(BaseDao):
    """
    Queries related to ML Model.
    """

    def get_paginated_llm_experiments(self, request, page, page_size, search):
        query = (
            self.db_session.query(LLMExperiment)
            .options(
                selectinload(LLMExperiment.experiment_settings),
                selectinload(LLMExperiment.dataset).selectinload(LLMDataRegistry.source),
                selectinload(LLMExperiment.compute),
                selectinload(LLMExperiment.model),
                selectinload(LLMExperiment.created_by_user),
            )
            .filter(
                LLMExperiment.deleted_at.is_(None),
            )
        )
        if search:
            # Search Filter
            query = query.filter(LLMExperiment.name.contains(search))

        # Sorting
        query = query.order_by(desc(LLMExperiment.created_at))
        # Pagination(Using offset and limit)
        paginated_query = self.perform_pagination(query, page, page_size)
        return paginated_query.all(), query.count()

    def get_llm_experiments(self, request, search):
        query = (
            self.db_session.query(LLMExperiment)
            .options(
                selectinload(LLMExperiment.experiment_settings),
                selectinload(LLMExperiment.dataset).selectinload(LLMDataRegistry.source),
                selectinload(LLMExperiment.compute),
                selectinload(LLMExperiment.model),
                selectinload(LLMExperiment.created_by_user),
            )
            .filter(
                LLMExperiment.deleted_at.is_(None),
            )
        )
        if search:
            # Search Filter
            query = query.filter(LLMExperiment.name.contains(search))

        # Sorting
        query = query.order_by(desc(LLMExperiment.created_at))

        return query.all()

    def get_llm_experiment_by_name(self, name, include_deleted=False):
        queryset = self.db_session.query(LLMExperiment).filter_by(name=name)
        if not include_deleted:
            queryset = queryset.filter(LLMExperiment.deleted_at.is_(None))
        return queryset.first()

    def get_llm_experiment_by_id(self, id, include_deleted=False):
        queryset = (
            self.db_session.query(LLMExperiment)
            .options(
                selectinload(LLMExperiment.model),
                selectinload(LLMExperiment.created_by_user),
            )
            .filter_by(id=id)
        )
        if not include_deleted:
            queryset = queryset.filter(LLMExperiment.deleted_at.is_(None))
        return queryset.first()

    def get_llm_experiment_detail_by_id(self, id, include_deleted=False):
        queryset = (
            self.db_session.query(LLMExperiment)
            .options(
                selectinload(LLMExperiment.experiment_settings),
                selectinload(LLMExperiment.dataset).selectinload(LLMDataRegistry.source),
                selectinload(LLMExperiment.compute),
                selectinload(LLMExperiment.model),
                selectinload(LLMExperiment.created_by_user),
            )
            .filter_by(id=id)
        )
        if not include_deleted:
            queryset = queryset.filter(LLMExperiment.deleted_at.is_(None))
        return queryset.first()

    def get_llm_experiments_by_ids(self, ids):
        queryset = self.db_session.query(LLMExperiment).filter(LLMExperiment.id.in_(ids)).all()
        return queryset

    def get_llm_experiment_checkpoints_by_llm_experiment_id(self, experiment_id):
        queryset = self.db_session.query(LLMExperimentCheckpoint).filter_by(experiment_id=experiment_id).all()
        return queryset

    def get_llm_experiment_checkpoint_by_name(self, experiment_id, name):
        queryset = (
            self.db_session.query(LLMExperimentCheckpoint).filter_by(experiment_id=experiment_id, name=name).first()
        )
        return queryset

    def get_llm_experiment_checkpoint_by_id(self, experiment_id, id):
        queryset = self.db_session.query(LLMExperimentCheckpoint).filter_by(experiment_id=experiment_id, id=id).first()
        return queryset

    def get_llm_experiment_result_by_llm_experiment_id(self, id, include_deleted=False):
        queryset = (
            self.db_session.query(LLMExperimentResult)
            .options(
                selectinload(LLMExperimentResult.created_by_user),
            )
            .filter(LLMExperimentResult.experiment_id == id)
        )
        if not include_deleted:
            queryset = queryset.filter(LLMExperimentResult.deleted_at.is_(None))
        return queryset.first()

    def get_llm_experiment_train_logs_from_fileshare(self, folder_path):
        file_path = folder_path + "/trainer_log_ui.jsonl"
        response = AzureFileShareService().get_file_data_from_specific_path("train-repository", file_path)
        return response["data"]

    def get_llm_experiment_checkpoint_logs_from_fileshare(self, folder_path):
        file_path = folder_path + "/checkpoint_log.jsonl"
        response = AzureFileShareService().get_file_data_from_specific_path("train-repository", file_path)
        return response["data"]

    def create_llm_experiment_settings(self, user, validated_data):
        try:
            # Inserting Data in the DB
            llm_experiment_settings = LLMExperimentSetting(**validated_data)
            llm_experiment_settings.created_by = user["id"]
            llm_experiment_settings.is_active = True
            llm_experiment_settings.created_at = self.set_created_at()
            self.db_session.add(llm_experiment_settings)
            self.db_session.flush()
            # self.db_session.commit()
            self.db_session.refresh(llm_experiment_settings)
            return llm_experiment_settings

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in creating LLMExperiment Settings.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_dataset(self, user, validated_data):
        try:
            # Inserting Data in the DB
            source_type = validated_data.pop("source_type")
            llm_dataset_source = LLMDatasetSource(source_type=source_type, is_active=True)
            llm_dataset_source.created_by = user["id"]
            llm_dataset_source.is_active = True
            self.db_session.add(llm_dataset_source)
            self.db_session.flush()
            # self.db_session.commit()
            self.db_session.refresh(llm_dataset_source)

            validated_data["source_id"] = llm_dataset_source.id

            llm_experiment_dataset = LLMDataRegistry(**validated_data)
            llm_experiment_dataset.created_by = user["id"]
            llm_experiment_dataset.is_active = True
            self.db_session.add(llm_experiment_dataset)
            self.db_session.flush()
            # self.db_session.commit()
            self.db_session.refresh(llm_experiment_dataset)

            return llm_experiment_dataset

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in creating Dataset.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_llm_experiment(self, user, validated_data):
        try:
            # Inserting Data in the DB
            settings = validated_data.pop("settings")
            if settings is not None:
                llm_experiment_settings = self.create_llm_experiment_settings(user, settings)
                validated_data["experiment_settings_id"] = llm_experiment_settings.id

            # dataset = validated_data.pop('dataset')
            # if dataset is not None:
            #     dataset = self.create_dataset(user, dataset)
            #     validated_data['dataset_id'] = dataset.id

            validated_data["model_id"] = validated_data.pop("base_model_id")
            validated_data["status"] = "Created"

            validated_data["created_at"] = self.set_created_at()

            llm_experiment = LLMExperiment(**validated_data)
            llm_experiment.created_by = user["id"]

            self.db_session.add(llm_experiment)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(llm_experiment)
            return llm_experiment

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in Initiating Finetuning.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create_llm_experiment_result(self, user, validated_data):
        try:
            llm_experiment_result = LLMExperimentResult(**validated_data)
            llm_experiment_result.created_by = user["id"]
            llm_experiment_result.is_active = True

            self.db_session.add(llm_experiment_result)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(llm_experiment_result)
            return llm_experiment_result
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in creating experiment result.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def bulk_create_llm_experiment_checkpoint(self, user, validated_data):
        try:
            llm_experiment_checkpoints = self.db_session.scalars(
                insert(LLMExperimentCheckpoint).returning(LLMExperimentCheckpoint),
                validated_data["checkpoints"],
            )
            self.db_session.flush()
            self.db_session.commit()
            # self.db_session.refresh(llm_experiment_checkpoints)
            # for id, input_record in zip(validated_data["checkpoints"], llm_experiment_checkpoints):
            #     input_record["id"] = id
            return llm_experiment_checkpoints.all()
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in creating experiment checkpoint.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_llm_experiment_settings(self, user, experiment_setting, validated_data):
        try:
            # Inserting Data in the DB
            for key, value in validated_data.items():
                if value is not None:
                    setattr(experiment_setting, key, value)

            # Inserting Data in the DB
            experiment_setting.updated_by = user["id"]
            self.db_session.add(experiment_setting)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(experiment_setting)
            return experiment_setting

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in creating LLMExperiment Settings.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_llm_experiment(self, user, llm_experiment, validated_data):
        try:
            # Inserting Data in the DB
            settings = validated_data.pop("settings")
            if settings is not None:
                llm_experiment_settings = self.update_llm_experiment_settings(user, llm_experiment.settings, settings)
                validated_data["llm_experiment_settings_id"] = llm_experiment_settings.id

            # dataset = validated_data.pop('dataset')
            # if dataset is not None:
            #     dataset = self.create_dataset(user, dataset)
            #     validated_data['dataset_id'] = dataset.id

            # Inserting Data in the DB
            for key, value in validated_data.items():
                if value is not None:
                    setattr(llm_experiment, key, value)

            llm_experiment.updated_by = user["id"]

            self.db_session.add(llm_experiment)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(llm_experiment)
            return llm_experiment

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in Initiating Finetuning.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_llm_experiment_status(self, user, llm_experiment_id, status):
        llm_experiment = self.get_llm_experiment_by_id(llm_experiment_id)
        llm_experiment.status = status
        llm_experiment.updated_by = user["id"]
        self.db_session.add(llm_experiment)
        self.db_session.commit()
        self.db_session.refresh(llm_experiment)
        return llm_experiment

    def update_llm_experiment_result(self, user, llm_experiment_result, validated_data):
        try:
            # Inserting Data in the DB
            for key, value in validated_data.items():
                if value is not None:
                    setattr(llm_experiment_result, key, value)

            llm_experiment_result.updated_by = user["id"]

            self.db_session.add(llm_experiment_result)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(llm_experiment_result)
            return llm_experiment_result

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in updating experiment result.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update_llm_experiment_checkpoint(self, user, llm_experiment_checkpoint, validated_data):
        try:
            # Inserting Data in the DB
            for key, value in validated_data.items():
                if value is not None:
                    setattr(llm_experiment_checkpoint, key, value)

            llm_experiment_checkpoint.updated_by = user["id"]

            self.db_session.add(llm_experiment_checkpoint)
            self.db_session.flush()
            self.db_session.commit()
            self.db_session.refresh(llm_experiment_checkpoint)
            return llm_experiment_checkpoint

        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                message="Error occurred in updating experiment checkpoint.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
