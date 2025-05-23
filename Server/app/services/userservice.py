from app.utils.base_logger import BaseLogger
from app.models import User
from app.services.baseservice import BaseService
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

app_logger = BaseLogger(logger_name="UserService").get_logger()


class UserService(BaseService):

    @staticmethod
    def create_user(db: Session, first_name: str, last_name: str, email: str, password: str, role_id: int = None, department_id: int = None):
        try:
            # Check if the user already exists
            existing_user = db.query(User).filter_by(email=email).first()
            if existing_user:
                app_logger.error(f"User with email {email} already exists.")
                return None

            # Create user instance without password first
            user = UserService.create(db, User, first_name=first_name, last_name=last_name, email=email, roles=role_id, department_id=department_id)
            if user:
                # Set hashed password and commit
                user.set_password(password)
                db.commit()
                db.refresh(user)
                return user
            return None
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error creating user {email}: {e}")
            return None

    @staticmethod
    def get_user_by_id(db: Session, user_id: int):
        try:
            return UserService.get(db, User, id=user_id)
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching user with id {user_id}: {e}")
            return None

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        try:
            return UserService.get(db, User, email=email)
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching user with email {email}: {e}")
            return None

    @staticmethod
    def update_user(db: Session, user_id: int, **updates):
        try:
            return UserService.update(db, User, user_id, **updates)
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error updating user with id {user_id}: {e}")
            return None

    @staticmethod
    def delete_user(db: Session, user_id: int):
        try:
            return UserService.delete(db, User, user_id)
        except SQLAlchemyError as e:
            db.rollback()
            app_logger.error(f"Error deleting user with id {user_id}: {e}")
            return None


    @staticmethod
    def get_user_from_db(email: str, db: Session):
        try:
            return db.query(User).filter(User.email == email).first()
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching user with email {email}: {e}")
            return None
        
    @staticmethod
    def get_all_users(db: Session):
        try:
            return db.query(User).all()
        except SQLAlchemyError as e:
            app_logger.error(f"Error fetching all users: {e}")
            return []