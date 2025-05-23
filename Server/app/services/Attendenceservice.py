from app.db import SessionLocal
from app.utils.base_logger import BaseLogger
from app.models import Attendance, Employee, Role
from app.services.baseservice import BaseService
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

app_logger = BaseLogger(logger_name="AttendanceService").get_logger()


class AttendanceService(BaseService):

    @staticmethod
    def create_attendance(db: Session, employee_id: int, date, status: str):
        try:
            return AttendanceService.create(db, Attendance, employee_id=employee_id, date=date, status=status)
        except SQLAlchemyError as e:
            AttendanceService.logger.error(f"Error creating attendance for employee {employee_id} on {date}: {e}")
            return None

    @staticmethod
    def get_attendance_by_id(db: Session, attendance_id: int):
        try:
            return AttendanceService.get(db, Attendance, id=attendance_id)
        except SQLAlchemyError as e:
            AttendanceService.logger.error(f"Error fetching attendance with id {attendance_id}: {e}")
            return None

    @staticmethod
    def update_attendance(db: Session, attendance_id: int, **updates):
        try:
            return AttendanceService.update(db, Attendance, attendance_id, **updates)
        except SQLAlchemyError as e:
            AttendanceService.logger.error(f"Error updating attendance with id {attendance_id}: {e}")
            return None

    @staticmethod
    def delete_attendance(db: Session, attendance_id: int):
        try:
            return AttendanceService.delete(db, Attendance, attendance_id)
        except SQLAlchemyError as e:
            AttendanceService.logger.error(f"Error deleting attendance with id {attendance_id}: {e}")
            return None