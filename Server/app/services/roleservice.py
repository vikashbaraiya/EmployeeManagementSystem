from app.db import SessionLocal
from app.utils.base_logger import BaseLogger
from app.models import Role
from app.services.baseservice import BaseService
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

app_logger = BaseLogger(logger_name="RoleService").get_logger()

class RoleService(BaseService):

    @staticmethod
    def create_role(db: Session, name: str):
        try:
            with SessionLocal() as db:
                return RoleService.create(db, Role, name=name)
        except SQLAlchemyError as e:
            app_logger.error(f"Error creating role '{name}': {e}")
            return None

    @staticmethod
    def get_role_by_id(db: Session, role_id: int):
        try:
            with SessionLocal() as db:
                # Check if the role already exists
                existing_role = db.query(Role).filter_by(id=role_id).first()
                if existing_role:
                    return existing_role
            return RoleService.get(db, Role, id=role_id)
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching role with ID {role_id}: {e}")
            return None

    @staticmethod
    def get_role_by_name(db: Session, name: str):
        try:
            with SessionLocal() as db:
                # Check if the role already exists
                existing_role = db.query(Role).filter_by(name=name).first()
                if existing_role:
                    return existing_role
            return RoleService.get(db, Role, name=name)
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching role with name '{name}': {e}")
            return None

    @staticmethod
    def update_role(db: Session, role_id: int, **updates):
        try:
            return RoleService.update(db, Role, role_id, **updates)
        except SQLAlchemyError as e:
            app_logger.error(f"Error updating role with ID {role_id}: {e}")
            return None

    @staticmethod
    def delete_role(db: Session, role_id: int):
        try:
            return RoleService.delete(db, Role, role_id)
        except SQLAlchemyError as e:
            app_logger.error(f"Error deleting role with ID {role_id}: {e}")
            return None

    @staticmethod
    def get_role_from_db(role_name: str, db: Session):
        try:
            with SessionLocal() as db:
                return db.query(Role).filter_by(name=role_name).first()
        except SQLAlchemyError as e:
            app_logger.error(f"Error checking for existing role '{role_name}': {e}")
            return None