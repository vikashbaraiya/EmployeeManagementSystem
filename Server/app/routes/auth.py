from app.db import get_db
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
# from flask_jwt_extended import create_access_token, jwt_required, unset_jwt_cookies
from app.utils.helpers import UtilityHelper
from app.views.authview import add_role, get_current_user, logout_user, resend_otp, signin, signup_user, get_users_data, verify_otp, forgot_password, verify_forgot_password_otp, resend_reset_otp



auth_router = APIRouter(prefix="/auth", tags=["Auth"])


@auth_router.post('/roles')
async def add_role_endpoint(request: Request):
    """
    API endpoint to add a role by calling the add_role function.
    """
    data = await request.json()
    data = UtilityHelper.clean_bleach(data)
    return add_role(data)

@auth_router.get('/get-current-user')
def get_user_endpoint():
    """
    API endpoint to retrieve user information.
    """
    return get_current_user()


@auth_router.get('/users')
def get_users_endpoint():
    """
    API endpoint to retrieve all users.
    """
    return get_users_data()

@auth_router.post('/login')
async def login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    data = UtilityHelper.clean_bleach(data)
    return signin(data, db)


@auth_router.post('/logout')
def logout():
    return logout_user()


@auth_router.post('/register')
async def add_user(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    cleaned_data = UtilityHelper.clean_bleach(data)
    return signup_user(cleaned_data, db)


@auth_router.post('/verify-otp')
async def verify_otp_endpoint(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    cleaned_data = UtilityHelper.clean_bleach(data)
    return verify_otp(cleaned_data, request, db)


@auth_router.post("/resend-otp")
async def resend(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    cleaned_data = UtilityHelper.clean_bleach(data)
    return await resend_otp(cleaned_data, request, db)



@auth_router.post('/forgot-password')
async def forgot_password_otp_send(request: Request):
    data = await UtilityHelper.clean_bleach(request.json())
    return forgot_password(data)


@auth_router.route('/verify-password-otp')
async def verify_password_otp(request: Request):
    data = await UtilityHelper.clean_bleach(request.json())
    return verify_forgot_password_otp(data)


@auth_router.post('/resend-reset-otp')
async def resend_reset_password_otp(request: Request):
    data = await UtilityHelper.clean_bleach(request.json())
    return resend_reset_otp(data)