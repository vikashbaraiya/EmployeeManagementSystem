from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware
from dotenv import load_dotenv, find_dotenv
import os

from app.extensions import make_celery
from app.security.security import SecurityHeaders
from app.routes import register_routes
from app.utils.base_logger import BaseLogger
from app.EmailConfig.EmailBase import BaseMailer
from app.EmailConfig.EmailService import EmailService
from .db import engine, Base

# Load env variables
load_dotenv(find_dotenv())
logger = BaseLogger(logger_name="AppInitialization").get_logger()

def create_app() -> FastAPI:
    logger.info("Initializing FastAPI application...")

    app = FastAPI()


    # Register a global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal Server Error"},
        )
    # Attach middleware and extensions
    # app.add_middleware(SecurityHeaders)
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=os.environ.get('ORIGINS', '*').split(','),
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Static files
    app.mount("/static", StaticFiles(directory="static"), name="static")

    # Init Extensions
    
    make_celery(app)
    
    # Database initialization
    Base.metadata.create_all(bind=engine)

    # Register routes
    register_routes(app)

    # Email service in request state
    mailer = BaseMailer(app)
    email_service = EmailService(mailer)
    app.state.email_service = email_service

    @app.middleware("http")
    async def email_service_middleware(request: Request, call_next):
        request.state.email_service = app.state.email_service
        response = await call_next(request)
        return response

    return app

   

app = create_app()
