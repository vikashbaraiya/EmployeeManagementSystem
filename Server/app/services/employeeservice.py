from app.db import SessionLocal
from app.utils.base_logger import BaseLogger
from app.models import Employee, Role
from app.services.baseservice import BaseService
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

app_logger = BaseLogger(logger_name="EmoloyeeService").get_logger()

class EmployeeService(BaseService):

    @staticmethod
    def create_employee(db: Session, user_id: int, employee_code: str):
        try:
            return EmployeeService.create(db, Employee, user_id=user_id, employee_code=employee_code)
        except SQLAlchemyError as e:
            EmployeeService.logger.error(f"Error creating employee {employee_code}: {e}")
            return None

    @staticmethod
    def get_employee_by_id(db: Session, employee_id: int):
        try:
            return EmployeeService.get(db, Employee, id=employee_id)
        except SQLAlchemyError as e:
            EmployeeService.logger.error(f"Error fetching employee with id {employee_id}: {e}")
            return None

    @staticmethod
    def get_employee_by_code(db: Session, code: str):
        try:
            return EmployeeService.get(db, Employee, employee_code=code)
        except SQLAlchemyError as e:
            EmployeeService.logger.error(f"Error fetching employee with code {code}: {e}")
            return None

    @staticmethod
    def update_employee(db: Session, employee_id: int, **updates):
        try:
            return EmployeeService.update(db, Employee, employee_id, **updates)
        except SQLAlchemyError as e:
            EmployeeService.logger.error(f"Error updating employee with id {employee_id}: {e}")
            return None

    @staticmethod
    def delete_employee(db: Session, employee_id: int):
        try:
            return EmployeeService.delete(db, Employee, employee_id)
        except SQLAlchemyError as e:
            EmployeeService.logger.error(f"Error deleting employee with id {employee_id}: {e}")
            return None


