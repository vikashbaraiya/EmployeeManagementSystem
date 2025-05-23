from app.db import SessionLocal
from app.utils.base_logger import BaseLogger
from app.models import Attendance, Employee, LeaveRequest, Role
from app.services.baseservice import BaseService
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

app_logger = BaseLogger(logger_name="SalaryService").get_logger()

class SalaryService(BaseService):

    @staticmethod
    def create_salary(db: Session, employee_id: int, month: str, amount: float):
        try:
            return SalaryService.create(db, Salary, employee_id=employee_id, month=month, amount=amount)
        except SQLAlchemyError as e:
            SalaryService.logger.error(f"Error creating salary for employee {employee_id} for month {month}: {e}")
            return None

    @staticmethod
    def get_salary_by_id(db: Session, salary_id: int):
        try:
            return SalaryService.get(db, Salary, id=salary_id)
        except SQLAlchemyError as e:
            SalaryService.logger.error(f"Error fetching salary with id {salary_id}: {e}")
            return None

    @staticmethod
    def update_salary(db: Session, salary_id: int, **updates):
        try:
            return SalaryService.update(db, Salary, salary_id, **updates)
        except SQLAlchemyError as e:
            SalaryService.logger.error(f"Error updating salary with id {salary_id}: {e}")
            return None

    @staticmethod
    def delete_salary(db: Session, salary_id: int):
        try:
            return SalaryService.delete(db, Salary, salary_id)
        except SQLAlchemyError as e:
            SalaryService.logger.error(f"Error deleting salary with id {salary_id}: {e}")
            return None