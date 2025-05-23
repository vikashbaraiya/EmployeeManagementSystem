from fastapi import Request,Header, APIRouter, HTTPException, Depends, status, Response, Cookie
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from app.db import SessionLocal, get_db
from app.models import User, Role
from app.services.baseservice import BaseService
from app.utils.helpers import UtilityHelper
from app.utils.validator import DataValidator
from app.EmailConfig.EmailService import EmailService
from app.utils.base_logger import BaseLogger
from app.utils.config_loader import auth_user_type
from app.utils.jwt_utils import create_access_token, get_jwt_identity, get_tokens_for_user, verify_token
from app.config import settings
from app.schemas import RoleSchema, SignupSchema, SigninSchema, OTPSchema, EmailSchema, UserCreate

from app.services.roleservice import RoleService
app_logger = BaseLogger(logger_name="AppInitialization").get_logger()


def add_role(data: RoleSchema, db: Session = Depends(get_db)):  #  Actual session injected
    existing = RoleService.get_role_from_db(data['name'], db)
    if existing:
        raise HTTPException(status_code=400, detail="Role already exists")

    new_role = Role(name=data['name'])
    saved = RoleService.save_instance(db, new_role)  # Pass actual db session here

    if not saved:
        raise HTTPException(status_code=500, detail="Failed to save role")
    
    return {"message": f"Role '{data['name']}' added successfully"}


def get_current_user(request: Request, db: Session = Depends(get_db)):
    user_id = get_jwt_identity(request)
    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.serialize()


def get_users_data(db: Session = Depends(get_db)):
    """
    Retrieves all users from the database.
    """
    try:
        users_list = db.query(User).all()
        users = [
            {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
            for user in users_list
        ]
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# def signup(data: SignupSchema,request: Request, db: Session = Depends(get_db)):
#     email = data.email
#     if User.query.filter_by(email=email).first():
#         raise HTTPException(status_code=400, detail="User already exists")

#     user_role = db.query(Role).filter_by(name=auth_user_type).first()
#     if not user_role:
#         raise HTTPException(status_code=500, detail="User role does not exist")

#     is_valid, message = DataValidator.validate_email(email)
#     if not is_valid:
#         raise HTTPException(status_code=400, detail=message)

#     if not DataValidator.validate_password(data.password):
#         raise HTTPException(status_code=400, detail="Password does not meet complexity requirements")

#     new_user = User(
#         email=email,
#         first_name=data.first_name,
#         last_name=data.last_name,
#         otp=str(UtilityHelper.random_number()),
#         otp_generated_at=datetime.now()
#     )
#     new_user.set_password(data.password)
#     new_user.roles.append(user_role)
#     BaseService._add_instance(new_user)

#     try:
#         email_service = request.state.email_service
#         email_service.send_otp_email(new_user.first_name, new_user.otp, new_user.email)
#     except Exception as email_error:
#         app_logger.error(f"Failed to send email to {email}: {str(email_error)}")
#         raise HTTPException(status_code=500, detail="Failed to send OTP email")

#     BaseService._commit_session()
#     return {"message": "Signup successful. Please check your email to verify your OTP."}


def signup_user(
    data: UserCreate,
    db: Session = Depends(get_db),
):
    fixed_user_type_id = 4  # fixed role ID 'Employee'
    fixed_department_id = 1  # fixed department ID 'HR'
    role = RoleService.get_role_by_id(db, fixed_user_type_id)
    # Check if user already exists
    # breakpoint()
    existing_user = UserService.get_user_by_email(db, data["email"])
    if existing_user:
        return JSONResponse(status_code=400, content={"message":"Email already registered"})
    breakpoint()

    # Create user with fixed role id
    user = UserService.create_user(
        db,
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        password=data["password"],
        role_id=[role], # assuming create_user accepts this
        department_id=fixed_department_id
    )

    if not user:
        return JSONResponse(status_code=500, content={"error":"Failed to create user"})

    token = get_tokens_for_user(user)

    return JSONResponse(
        status_code=status.HTTP_201_CREATED,
        content={"token": token, "msg": "Registration Successful"}
    )


def verify_otp(data: OTPSchema,request: Request, db: Session = Depends(get_db)):
    user = UserService.get_user_from_db( data["email"], db)
    if not user:
        raise JSONResponse(status_code=404, detail={"message":"No user found with this email"})
    if user.confirmed:
        return JSONResponse(status_code=400, content={"message":"Email is already confirmed"})

    if user.otp == data['otp']:
        otp_time = user.otp_generated_at
        if isinstance(otp_time, str):
            otp_time = datetime.fromisoformat(otp_time)
        if datetime.now() - otp_time  <= timedelta(minutes=5):
            user.confirmed = True
            user.otp = None
            user.otp_generated_at = None
            db.commit()
            try:
                email_service = request.state.email_service
                email_service.send_welcome_email(user.first_name, user.email)
            except Exception as email_error:
                return JSONResponse(status_code=500, content={"error":"Email verified but welcome email failed"})

            # Create and return JWT access token
            access_token = create_access_token(data={"sub": str(user.id)})
            return {
                "message": "Email verified and welcome email sent",
                "access_token": access_token,
                "token_type": "bearer"
            }



# def get_user_by_email(db: Session, email: str):
#     return db.query(User).filter_by(email=email).first()

from app.services.userservice import UserService

def signin(data: SigninSchema, db: Session = Depends(get_db)):
    user = UserService.get_user_from_db(data['email'], db)
    serialized_user = user.serialize() if user else None
    if user and user.confirmed and user.check_password(data['password']):
        access_token_expires = settings.JWT_ACCESS_TOKEN_EXPIRES
        access_token = create_access_token(
            data={"sub": str(serialized_user['id'])},  # ensure ID is a string
            expires_delta=access_token_expires
        )
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "data": user.serialize()
        }

    elif user and not user.confirmed:
        return JSONResponse(status_code=403, content={"message":"OTP sent. Verify your email to continue."})

    return JSONResponse(status_code=401, content={"error":"Invalid credentials"})


def logout_user():
    # No session or cookie handling unless you're using OAuth2 with cookies
    app_logger.debug("Logout Successfully !!")
    return {"message": "Logged out successfully"}


def forgot_password(data: EmailSchema,request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found with this email.")
    w
    user.otp = str(UtilityHelper.random_number())
    user.otp_generated_at = datetime.now()
    db.commit()

    try:
        email_service = request.state.email_service
        email_service.send_forgot_password_otp(user.first_name, user.otp, user.email)
        app_logger.info(f"Password reset OTP sent to {user.email}.")
        return {"message": "OTP sent to your email. Please check your inbox."}
    except Exception as e:
        app_logger.error(f"Failed to send email to {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send OTP email.")


def verify_forgot_password_otp(data: OTPSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=data.email).first()
    if not user or user.otp != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP.")

    if datetime.now() - user.otp_generated_at <= timedelta(minutes=5):
        user.otp = None
        user.otp_generated_at = None
        db.commit()
        return {"message": "OTP verified successfully! You can now reset your password."}
    else:
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

def register_user(user_data, email_service):
    first_name = getattr(user_data, "first_name", None) or user_data.get("first_name")
    otp = getattr(user_data, "otp", None) or user_data.get("otp")
    email = getattr(user_data, "email", None) or user_data.get("email")

    email_service.send_resend_otp_email(first_name, otp, email)

async def resend_otp(
    data: EmailSchema,
    request: Request,  # Required for request.state
    db: Session = Depends(get_db),
):       
    # user = db.query(User).filter_by(email=data.email).first()
    user = UserService.get_user_by_email(db, data["email"])
    if not user:
        raise HTTPException(status_code=404, detail="No user found with this email.")

    if user.confirmed:
        raise HTTPException(status_code=400, detail="Email is already confirmed.")

    # OTP exists and is still valid
    if user.otp and user.otp_generated_at:
        otp_time = user.otp_generated_at
        if isinstance(otp_time, str):
            otp_time = datetime.fromisoformat(otp_time)
        if datetime.now() - otp_time < timedelta(minutes=1):
            raise HTTPException(
                status_code=400,
                detail="Please wait until the previous OTP expires before requesting a new one."
            )
        else:
            user.otp = None
            user.otp_generated_at = None
            db.commit()
    # Generate a new OTP
    user.otp = str(UtilityHelper.random_number())
    user.otp_generated_at = datetime.now()
    db.commit()

    try:
        email_service = request.state.email_service
        register_user(user, email_service=email_service)
        app_logger.info(f"New OTP email resent to {user.email}.")
        return {"message": "New OTP has been resent. Please check your inbox."}
    except Exception as e:
        app_logger.error(f"Failed to send OTP email to {user.email}: {str(e)}")
        return JSONResponse(status_code=500, content={"error":"Failed to send OTP email."})

def resend_reset_otp(data: EmailSchema,request: Request, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="No user found with this email.")

    if user.otp and datetime.now() - user.otp_generated_at < timedelta(minutes=1):
        raise HTTPException(status_code=400, detail="Please wait until the previous OTP expires before requesting a new one.")

    user.otp = str(UtilityHelper.random_number())
    user.otp_generated_at = datetime.now()
    db.commit()

    try:
        email_service = request.state.email_service
        email_service.send_resend_otp_email(user.first_name, user.otp, user.email)
        app_logger.info(f"New OTP email resent to {user.email}.")
        return {"message": "New OTP has been resent. Please check your inbox."}
    except Exception as e:
        app_logger.error(f"Failed to resend OTP to {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to resend OTP email.")
