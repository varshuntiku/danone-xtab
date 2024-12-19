# To run the data_seeder run below command in your terminal
# python data_seeder.py
import logging

from api.configs.settings import get_app_settings
from api.models.base_models import (
    ComputeService,
    InfraType,
    LLMCloudProvider,
    LLMComputeConfig,
)
from data_seed import (
    initial_compute_service_seed,
    initial_infra_type_seed,
    initial_llm_cloud_provider_seed,
    initial_llm_compute_config,
)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

settings = get_app_settings()

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db_session = SessionLocal()


def seed_data():
    try:
        # Seeding default User Groups

        llm_cloud_provider_exist = (
            db_session.query(LLMCloudProvider)
            .filter(LLMCloudProvider.name == initial_llm_cloud_provider_seed["name"])
            .count()
        )
        if llm_cloud_provider_exist:
            print(
                f'LLM Cloud Provider already exists {initial_llm_cloud_provider_seed["name"]} already exists: SKIPPED'
            )
        else:
            new_llm_cloud_provider = LLMCloudProvider(name=initial_llm_cloud_provider_seed["name"])
            db_session.add(new_llm_cloud_provider)
            print(f'LLM Cloud Provider  {initial_llm_cloud_provider_seed["name"]} : Added')

        db_session.flush()

        infra_type_exist = db_session.query(InfraType).filter(InfraType.name == initial_infra_type_seed["name"]).count()

        if infra_type_exist:
            print(f'Infra type already exists {initial_infra_type_seed["name"]} already exists: SKIPPED')
        else:
            new_infra_type = InfraType(
                name=initial_infra_type_seed["name"], cloud_provider_id=initial_infra_type_seed["cloud_provider_id"]
            )
            db_session.add(new_infra_type)
            print(f'Infra type {initial_infra_type_seed["name"]} Added')
        db_session.flush()

        for initial_llm_compute_service in initial_compute_service_seed:
            llm_compute_service_exist = (
                db_session.query(ComputeService)
                .filter(ComputeService.name == initial_llm_compute_service["name"])
                .count()
            )

            if llm_compute_service_exist:
                print(
                    f'llm cloud compute service already exists {initial_llm_compute_service["name"]} already exists: SKIPPED'
                )

            else:
                new_llm_compute_service = ComputeService(
                    name=initial_llm_compute_service["name"],
                    compute_type=initial_llm_compute_service["compute_type"],
                    cloud_provider_id=initial_llm_compute_service["cloud_provider_id"],
                    is_active=initial_llm_compute_service["is_active"],
                )
                db_session.add(new_llm_compute_service)
                print(f'llm cloud compute service {initial_llm_compute_service["name"]} Added')
        db_session.flush()

        for initial_llm_compute_config1 in initial_llm_compute_config:
            llm_compute_config_exist = (
                db_session.query(LLMComputeConfig)
                .filter(LLMComputeConfig.sku == initial_llm_compute_config1["sku"])
                .count()
            )

            if llm_compute_config_exist:
                print(
                    f'llm cloud compute config already exists {initial_llm_compute_config1["sku"]} already exists: SKIPPED'
                )

            else:
                new_llm_compute_config = LLMComputeConfig(
                    sku=initial_llm_compute_config1["sku"],
                    type=initial_llm_compute_config1["type"],
                    compute_type=initial_llm_compute_config1["compute_type"],
                    compute_service_id=initial_llm_compute_config1["compute_service_id"],
                    vcpu=initial_llm_compute_config1["vcpu"],
                    ram=initial_llm_compute_config1["ram"],
                    iops=initial_llm_compute_config1["iops"],
                    storage_size=initial_llm_compute_config1["storage_size"],
                    estimated_cost=initial_llm_compute_config1["estimated_cost"],
                    data_disks=initial_llm_compute_config1["data_disks"],
                    cloud_provider_id=initial_llm_compute_config1["cloud_provider_id"],
                    is_active=initial_llm_compute_config1["is_active"],
                )
                db_session.add(new_llm_compute_config)
                print(f'llm compute config  {initial_llm_compute_config1["sku"]} Added')

        db_session.commit()
        db_session.close()

        print("Data seeding completed")

    except Exception as e:
        db_session.rollback()
        db_session.close()
        logging.error(e)
        print("Error seeding data")


seed_data()
