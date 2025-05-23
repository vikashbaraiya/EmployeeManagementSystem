from fastapi import Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from app.models import User
from sqlalchemy.orm import Session
from app.db import get_db  # Your SQLAlchemy session dependency

def get_current_user(Authorize: AuthJWT = Depends(), db: Session = Depends(get_db)) -> User:
    try:
        Authorize.jwt_required()
        user_id = Authorize.get_jwt_subject()
        user = db.query(User).get(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        return user
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token or expired")

def admin_required(current_user: User = Depends(get_current_user)):
    if not current_user.has_role('admin'):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied, Admin role required")
