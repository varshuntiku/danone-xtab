import logging

from api.daos.base_daos import BaseDao
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import SolutionBluePrint, SolutionBlueprintDownloadInfo
from fastapi import status


class SolutionBluePrintDao(BaseDao):
    def create_blueprint(
        self, user, name, kind, meta_data, filepath, visual_graph, dir_tree, refs, project_id
    ) -> SolutionBluePrint:
        """
        Create a new SolutionBluePrint record.

        Args:
            name (str): Name of the SolutionBluePrint.
            kind (str): Kind or type of the SolutionBluePrint.
            meta_data (str): Metadata related to the SolutionBluePrint.
            filepath (str): Filepath where the SolutionBluePrint is stored.
            visual_graph (str): JSON string representing the visual graph.
            dir_tree (str): Directory tree structure as JSON string.
            refs (str): Any references associated with the SolutionBluePrint.
            project_id (int): ID of the associated project.

        Returns:
            SolutionBluePrint: The newly created SolutionBluePrint object.
        """
        try:
            new_blueprint = SolutionBluePrint(
                name=name,
                kind=kind,
                meta_data=meta_data,
                filepath=filepath,
                visual_graph=visual_graph,
                dir_tree=dir_tree,
                refs=refs,
                project_id=project_id,
            )
            if "id" in user:
                new_blueprint.created_by = user["id"]
            self.db_session.add(new_blueprint)
            self.db_session.flush()
            self.db_session.refresh(new_blueprint)
            self.db_session.commit()
            return new_blueprint
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                message="Error occured while creating Solution BluePrint.",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def get_blueprint_by_project_id(self, project_id):
        try:
            solution_bp = (
                self.db_session.query(SolutionBluePrint).filter(SolutionBluePrint.project_id == project_id).first()
            )
            return solution_bp
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error fetching SolutionBluePrint."},
            )

    def update_blueprint(self, user, solution_bp, visual_graph, dir_tree, meta_data=None, project_id=None):
        try:
            solution_bp.visual_graph = visual_graph
            solution_bp.dir_tree = dir_tree
            if meta_data:
                solution_bp.meta_data = meta_data
            if project_id:
                solution_bp.project_id = project_id
            if "id" in user:
                solution_bp.updated_by = user["id"]
            self.db_session.add(solution_bp)
            self.db_session.flush()
            self.db_session.refresh(solution_bp)
            self.db_session.commit()
            return solution_bp
        except Exception as e:
            logging.exception(e)
            self.db_session.rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error updating SolutionBluePrint."},
            )

    def get_blueprint_by_name(self, name):
        try:
            solution_bp = self.db_session.query(SolutionBluePrint).filter(SolutionBluePrint.name == name).first()
            return solution_bp
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error fetching SolutionBluePrint."},
            )

    def get_blueprint_by_id(self, blueprint_id):
        try:
            solution_bp = self.db_session.query(SolutionBluePrint).filter(SolutionBluePrint.id == blueprint_id).first()
            return solution_bp
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error fetching SolutionBluePrint."},
            )

    def update_blueprint_download_info(self, id, status: str, progress: int, log: str, visual_graph=None):
        try:
            file_operation = (
                self.db_session.query(SolutionBlueprintDownloadInfo)
                .filter(SolutionBlueprintDownloadInfo.id == id)
                .first()
            )
            if file_operation:
                file_operation.status = status
                file_operation.progress = progress
                file_operation.log = log
            if file_operation and visual_graph:
                file_operation.visual_graph = visual_graph
            self.db_session.commit()
            self.db_session.refresh(file_operation)
            return file_operation
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error fetching SolutionBluePrint."},
            )

    def create_blueprint_download_info(self, user, file_operation):
        try:
            db_file_operation = SolutionBlueprintDownloadInfo(**file_operation)
            if "id" in user:
                db_file_operation.created_by = user["id"]
            self.db_session.add(db_file_operation)
            self.db_session.commit()
            self.db_session.refresh(db_file_operation)
            return db_file_operation
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error fetching SolutionBluePrint."},
            )

    def get_solution_bp(self, user):
        try:
            solution_bp = (
                self.db_session.query(SolutionBluePrint)
                .filter(SolutionBluePrint.created_by == user["id"], SolutionBluePrint.golden is True)
                .all()
            )
            return solution_bp
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error fetching SolutionBluePrint."},
            )

    def create_solution_bp(self, user, name, file_path, is_super_admin=False):
        try:
            solution_bp = (
                SolutionBluePrint(name=name, filepath=file_path, golden=True)
                if is_super_admin
                else SolutionBluePrint(name=name, filepath=file_path)
            )
            if "id" in user:
                solution_bp.created_by = user["id"]
            self.db_session.add(solution_bp)
            self.db_session.commit()
            self.db_session.refresh(solution_bp)
            return solution_bp
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message="Error fetching SolutionBluePrint.",
            )

    def on_load_solution_bp(self, bp_name: str):
        try:
            solution_bp = self.db_session.query(SolutionBluePrint).filter(SolutionBluePrint.name == bp_name).first()
            return solution_bp
        except Exception as e:
            logging.exception(e)
            self.perform_rollback()
            raise GeneralException(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                message={"error": "Error fetching SolutionBluePrint."},
            )
