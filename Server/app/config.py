from pydantic_settings import BaseSettings
from pydantic import Field, Json, AnyHttpUrl
from datetime import timedelta
from pathlib import Path
import os


class Settings(BaseSettings):
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    PRIVATE_KEY_PATH: Path = BASE_DIR / 'certificate' / 'private_key.pem'
    PUBLIC_KEY_PATH: Path = BASE_DIR / 'certificate' / 'public_key.pem'

    SECRET_KEY: str = Field('your_secret_key', env='SECRET_KEY')

    SESSION_TYPE: str = 'filesystem'
    CACHE_TYPE: str = 'simple'
    CACHE_DEFAULT_TIMEOUT: int = 300

    SSL_REQUEST_CSR: Path = Path(os.getcwd()) / "certificate" / "request.csr"
    SSL_KEY_FILE: Path = Path(os.getcwd()) / "certificate" / "keyfile.key"

    DATABASE_URL: str = Field('sqlite:///./site.db', env='DATABASE_URL')

    JWT_SECRET_KEY: str = Field('your_jwt_secret_key', env='JWT_SECRET_KEY')
    JWT_TOKEN_LOCATION: list = ['headers']
    JWT_ALGORITHM: str = 'HS256'
    JWT_PRIVATE_KEY: str = Field(default_factory=lambda: open(Path(__file__).resolve().parent.parent / 'certificate/private_key.pem').read())
    JWT_PUBLIC_KEY: str = Field(default_factory=lambda: open(Path(__file__).resolve().parent.parent / 'certificate/public_key.pem').read())
    JWT_ACCESS_TOKEN_EXPIRES: timedelta = timedelta(hours=10)

    UPLOAD_FOLDER: str = 'static/images'
    BASE_UPLOAD_FOLDER: str = str(Path(os.getcwd()) / 'static/images')

    MAIL_SERVER: str = 'smtp.gmail.com'
    MAIL_PORT: int = 587
    MAIL_USE_TLS: bool = True
    MAIL_USERNAME: str = Field(..., env='MAIL_USERNAME')
    MAIL_PASSWORD: str = Field(..., env='MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER: str = Field(..., env='MAIL_DEFAULT_SENDER')
    MAIL_USE_SSL: bool = False
    MAIL_DEBUG: bool = False

    DEBUG: bool = Field(default_factory=lambda: os.environ.get('FASTAPI_ENV') == 'development')

    origins: Json[list[AnyHttpUrl]] = Field(default_factory=lambda: ["http://127.0.0.1:3000"])


    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
