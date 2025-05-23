

import os
from fastapi import Body
from fastapi import UploadFile, File, Form, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import User
from app.services.baseservice import BaseService
from app.services.userservice import UserService
from app.utils.base_logger import BaseLogger
from app.utils.helpers import UtilityHelper
from werkzeug.utils import secure_filename
from app.config import settings
from app.utils.jwt_utils import get_current_user_id

if not os.path.exists(settings.BASE_UPLOAD_FOLDER):
    os.makedirs(settings.BASE_UPLOAD_FOLDER)


app_logger = BaseLogger(logger_name="ProfileView").get_logger()

async def update_user_profile_image(
    request: Request,
    file: UploadFile = File(...),
    user_name: str = Form(...),
    user_id: str = Form(...),
    db: Session = Depends(get_db)
):
    if not UtilityHelper.allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")

    filename = secure_filename(file.filename)
    extension = filename.split('.')[-1]
    saved_name = f"{user_name}_{user_id}.{extension}"
    file_path = os.path.join(settings.UPLOAD_FOLDER, saved_name)

    # Delete old image if any
    UtilityHelper.delete_old_file(file_path)

    # Save new image
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    user = db.query(User).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.file_name = saved_name
    BaseService._commit_session()

    image_url = f"/static/images/{saved_name}"
    return {"message": "Profile updated successfully", "image_url": image_url}



def update_user_profile(
    request: Request,
    data: dict = Body(...),
    db: Session = Depends(get_db)
):
    user_id = get_current_user_id(request)
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not data.get("first_name") or not data.get("last_name"):
        raise HTTPException(status_code=400, detail="First and last name required")

    user.first_name = data["first_name"]
    user.last_name = data["last_name"]
    user.email = data.get("email", user.email)

    if "password" in data and data["password"]:
        user.set_password(data["password"])

    try:
        if BaseService._commit_session():
            return {"message": "Profile updated successfully", "user": user.serialize()}
        else:
            raise HTTPException(status_code=500, detail="Failed to update profile")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def get_profile_data(
    request: Request,
    db: Session = Depends(get_db)
):
    user_id = get_current_user_id(request)
    user = UserService.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "message": "User profile retrieved successfully",
        "user": user.serialize()
    }