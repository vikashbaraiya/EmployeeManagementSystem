from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from app.db import get_db  # your session dependency
from app.services.userservice import (
     UserService
)

from app.schemas import (
    UserCreate, UserUpdate, UserOut,
)

user_router = APIRouter(prefix="/user", tags=["Users"])

@user_router.get("/users/{user_id}", response_model=UserOut)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@user_router.get("/users/", response_model=List[UserOut])
def list_users(db: Session = Depends(get_db)):
    users = UserService.get_all_users(db)
    if not users:
        raise HTTPException(status_code=404, detail="No users found")

    serialized_users = [user.serialize() for user in users]
    return JSONResponse(content={"data": serialized_users}, status_code=status.HTTP_200_OK)

@user_router.put("/users/{user_id}", response_model=UserOut)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    update_data = user_update.dict(exclude_none=True)
    if "password" in update_data:
        # Optional: handle password separately if needed, here ignoring for simplicity
        update_data.pop("password")  # Or implement password update logic
    updated = UserService.update_user(db, user_id, **update_data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found or update failed")
    return updated

@user_router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    deleted = UserService.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found or delete failed")

