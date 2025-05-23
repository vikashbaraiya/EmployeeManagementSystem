# app/tasks/bot_tasks.py
import re
from celery import shared_task
import requests

from app.services.baseservice import BaseService
from app.services.errorlogservice import ErrorLogService
from app.utils.base_logger import BaseLogger


# Initialize logger for the service
app_logger = BaseLogger(logger_name="TokenService").get_logger()
bot_manager_url = "127.0.0.1:8000"

@shared_task()
def test_task():
    return "Task executed successfully!"


@celery.task
def fetch_and_store_stock_data():
    for symbol in STOCKS:
        for function, data_type in [("TIME_SERIES_INTRADAY&interval=60min", "intraday"),
                                     ("TIME_SERIES_DAILY", "daily")]:
            records = fetch_stock_data(symbol, function, data_type)
            BaseService.store_data(records)
    app_logger.info('Store Data fetch and Stored.')
