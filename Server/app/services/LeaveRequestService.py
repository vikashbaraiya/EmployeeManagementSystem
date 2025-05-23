from app.db import SessionLocal
from app.utils.base_logger import BaseLogger
from app.models import Attendance, Employee, LeaveRequest, Role
from app.services.baseservice import BaseService
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

app_logger = BaseLogger(logger_name="LeaveRequestService").get_logger()

class LeaveRequestService(BaseService):

    @staticmethod
    def create_leave_request(db: Session, employee_id: int, start_date, end_date, reason: str, status: str = "Pending"):
        try:
            return LeaveRequestService.create(db, LeaveRequest, employee_id=employee_id, start_date=start_date, end_date=end_date, reason=reason, status=status)
        except SQLAlchemyError as e:
            LeaveRequestService.logger.error(f"Error creating leave request for employee {employee_id}: {e}")
            return None

    @staticmethod
    def get_leave_request_by_id(db: Session, leave_id: int):
        try:
            return LeaveRequestService.get(db, LeaveRequest, id=leave_id)
        except SQLAlchemyError as e:
            LeaveRequestService.logger.error(f"Error fetching leave request with id {leave_id}: {e}")
            return None

    @staticmethod
    def update_leave_request(db: Session, leave_id: int, **updates):
        try:
            return LeaveRequestService.update(db, LeaveRequest, leave_id, **updates)
        except SQLAlchemyError as e:
            LeaveRequestService.logger.error(f"Error updating leave request with id {leave_id}: {e}")
            return None

    @staticmethod
    def delete_leave_request(db: Session, leave_id: int):
        try:
            return LeaveRequestService.delete(db, LeaveRequest, leave_id)
        except SQLAlchemyError as e:
            LeaveRequestService.logger.error(f"Error deleting leave request with id {leave_id}: {e}")
            return None

