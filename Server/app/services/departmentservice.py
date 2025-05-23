from app.db import SessionLocal
from app.utils.base_logger import BaseLogger
from app.models import Department, Employee, Role
from app.services.baseservice import BaseService
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

app_logger = BaseLogger(logger_name="DepartmentService").get_logger()


class DepartmentService(BaseService):

    @staticmethod
    def create_department(db: Session, name: str):
        try:
            return DepartmentService.create(db, Department, name=name)
        except SQLAlchemyError as e:
            DepartmentService.logger.error(f"Error creating department {name}: {e}")
            return None

    @staticmethod
    def get_department_by_id(db: Session, dept_id: int):
        try:
            return DepartmentService.get(db, Department, id=dept_id)
        except SQLAlchemyError as e:
            DepartmentService.logger.error(f"Error fetching department with id {dept_id}: {e}")
            return None

    @staticmethod
    def get_department_by_name(db: Session, name: str):
        try:
            return DepartmentService.get(db, Department, name=name)
        except SQLAlchemyError as e:
            DepartmentService.logger.error(f"Error fetching department with name {name}: {e}")
            return None

    @staticmethod
    def update_department(db: Session, dept_id: int, **updates):
        try:
            return DepartmentService.update(db, Department, dept_id, **updates)
        except SQLAlchemyError as e:
            DepartmentService.logger.error(f"Error updating department with id {dept_id}: {e}")
            return None

    @staticmethod
    def delete_department(db: Session, dept_id: int):
        try:
            return DepartmentService.delete(db, Department, dept_id)
        except SQLAlchemyError as e:
            DepartmentService.logger.error(f"Error deleting department with id {dept_id}: {e}")
            return None

