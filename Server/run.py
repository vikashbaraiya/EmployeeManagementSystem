import uvicorn
from app import create_app
from app.extensions import make_celery
from app.config import settings

app = create_app()
celery = make_celery(settings.__dict__)  # Optional: only if needed in the same context

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
