from fastapi import Request
from pydantic import EmailStr
from starlette.exceptions import HTTPException
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
from typing import Optional, List, Tuple, Union

from app.config import settings
from app.utils.base_logger import BaseLogger

app_logger = BaseLogger(logger_name="BaseMailer").get_logger()


class BaseMailer:
    def __init__(self, app: Optional[Request] = None):
        # Initialization is done once per app lifecycle, not per request
        self.smtp_server = settings.MAIL_SERVER
        self.smtp_port = settings.MAIL_PORT
        self.username = settings.MAIL_USERNAME
        self.password = settings.MAIL_PASSWORD
        self.default_sender = settings.MAIL_DEFAULT_SENDER
        self.use_tls = settings.MAIL_USE_TLS
        self.use_ssl = settings.MAIL_USE_SSL

    def send_email(
        self,
        subject: str,
        recipients: Union[str, List[EmailStr]],
        html: str,
        body: Optional[str] = None,
        sender: Optional[str] = None,
        attachments: Optional[List[Tuple[str, bytes]]] = None,
    ):
        """
        Send an email using SMTP with optional attachments.
        """
        if isinstance(recipients, str):
            recipients = [recipients]

        if sender is None:
            sender = self.default_sender

        # Construct email
        message = MIMEMultipart()
        message['From'] = sender
        message['To'] = ", ".join(recipients)
        message['Subject'] = subject

        if body:
            message.attach(MIMEText(body, 'plain'))

        message.attach(MIMEText(html, 'html'))

        # Add attachments
        if attachments:
            for filename, file_content in attachments:
                part = MIMEApplication(file_content)
                part.add_header('Content-Disposition', 'attachment', filename=filename)
                message.attach(part)

        try:
            if self.use_ssl:
                server = smtplib.SMTP_SSL(self.smtp_server, self.smtp_port)
            else:
                server = smtplib.SMTP(self.smtp_server, self.smtp_port)

            if self.use_tls and not self.use_ssl:
                server.starttls()

            server.login(self.username, self.password)
            server.sendmail(sender, recipients, message.as_string())
            server.quit()

            app_logger.info(f"Email sent successfully to {', '.join(recipients)}")

        except Exception as e:
            app_logger.error(f"Failed to send email to {recipients}: {e}")
            raise HTTPException(status_code=500, detail="Failed to send email.")
