from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.db import SessionLocal
from app.models import Base  # Adjust import if needed
from app.utils.base_logger import BaseLogger

app_logger = BaseLogger(logger_name="BaseService").get_logger()


class BaseService:

    @staticmethod
    def _add_instance(db: Session, instance):
        try:
            db.add(instance)
            return True
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error adding instance {instance}: {e}")
            return False

    @staticmethod
    def _commit_session(db: Session):
        try:
            db.commit()
            return True
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error during commit: {e}")
            return False

    @staticmethod
    def rollback_session(db: Session):
        db.rollback()
        app_logger.info("Session has been rolled back")

    @staticmethod
    def save_instance(db: Session, instance):
        try:
            with SessionLocal() as db:
                # Check if the instance already exists
                existing_instance = db.query(instance.__class__).filter_by(id=instance.id).first()
                if existing_instance:
                    # Update the existing instance
                    for key, value in instance.__dict__.items():
                        setattr(existing_instance, key, value)
                    db.commit()
                    db.refresh(existing_instance)
                    return existing_instance
            db.add(instance)
            db.commit()
            db.refresh(instance)
            return instance
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error saving instance: {e}")
            return None

    @staticmethod
    def get(db: Session, model, **filters):
        try:
            return db.query(model).filter_by(**filters).first()
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching {model.__name__}: {e}")
            return None

    @staticmethod
    def get_all(db: Session, model, **filters):
        try:
            return db.query(model).filter_by(**filters).all()
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching all {model.__name__}: {e}")
            return []

    @staticmethod
    def create(db: Session, model, **data):
        try:
            instance = model(**data)
            db.add(instance)
            if instance:
                return instance
            else:
                return None
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error creating {model.__name__} with data {data}: {e}")
            return None

    @staticmethod
    def update(db: Session, model, id, **updates):
        try:
            instance = db.query(model).get(id)
            if instance:
                for key, value in updates.items():
                    setattr(instance, key, value)
                if BaseService._commit_session(db):
                    return instance
            return None
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error updating {model.__name__} with id {id}: {e}")
            return None

    @staticmethod
    def delete(db: Session, model, id):
        try:
            instance = db.query(model).get(id)
            if instance:
                db.delete(instance)
                if BaseService._commit_session(db):
                    return instance
            return None
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error deleting {model.__name__} with id {id}: {e}")
            return None

    @staticmethod
    def delete_by_filters(db: Session, model, **filters):
        try:
            instance = db.query(model).filter_by(**filters).first()
            if instance:
                db.delete(instance)
                if BaseService._commit_session(db):
                    app_logger.info(f"{model.__name__} deleted successfully with filters: {filters}")
                    return instance
            else:
                app_logger.info(f"No matching {model.__name__} found with filters: {filters}")
                return None
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error deleting {model.__name__} with filters {filters}: {e}")
            return None

    @staticmethod
    def store_data(db: Session, instances):
        try:
            if instances:
                db.bulk_save_objects(instances)
                BaseService._commit_session(db)
            else:
                app_logger.info("No data found to store")
                return None
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error saving bulk data: {e}")
            return None
