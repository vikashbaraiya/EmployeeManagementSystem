# routes/__init__.py or routes/register_routes.py

from fastapi import FastAPI
from .auth import auth_router
from .profile import profile_router
from .department import department_router
from .user import user_router
from .employee import employee_router
from .attendance import attendance_router


def register_routes(app: FastAPI):
    app.include_router(auth_router)
    app.include_router(profile_router)
    app.include_router(department_router)
    app.include_router(user_router)
    app.include_router(employee_router)
    app.include_router(attendance_router)
