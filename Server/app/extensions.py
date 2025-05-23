from celery import Celery, Task
from celery.beat import PersistentScheduler

celery_app: Celery = Celery(__name__)

class AppContextTask(Task):
    """
    Celery Task that can store the FastAPI app context if needed.
    """
    def __call__(self, *args, **kwargs):
        # FastAPI does not have the same concept of an app context,
        # so you'd manually manage access to resources (e.g., DB, settings).
        return super().__call__(*args, **kwargs)

def make_celery(app_config: dict):
    """
    Create and configure Celery instance for FastAPI.
    """
    celery_app.config_from_object(app_config, namespace="CELERY")

    # Optional: bind the app config or any services needed by tasks
    celery_app.Task = AppContextTask
    celery_app.conf.beat_scheduler = PersistentScheduler
    celery_app.autodiscover_tasks(['app.tasks'])

    return celery_app
