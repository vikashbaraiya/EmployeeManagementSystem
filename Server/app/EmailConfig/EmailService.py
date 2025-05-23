from typing import Optional, Union, List, Tuple
from app.EmailConfig.EmailBase import BaseMailer
from app.EmailConfig.EmailBulder import EmailBuilder


class EmailService:
    def __init__(self, mailer: BaseMailer):
        if not isinstance(mailer, BaseMailer):
            raise ValueError("A valid BaseMailer instance is required.")
        self.mailer = mailer

    def send_email(self, email_builder: EmailBuilder) -> None:
        """
        Sends the email using the BaseMailer after constructing it with EmailBuilder.
        """
        email_content = email_builder.get_email_content()

        recipients = email_builder.recipient_email
        if isinstance(recipients, str):
            recipients = [recipients]  # Ensure it's a list

        self.mailer.send_email(
            subject=email_content['subject'],
            recipients=recipients,
            html=email_content['html'],
            body=email_content['body'],
            attachments=email_content['attachments']
        )

    def send_otp_email(self, first_name: str, otp: str, recipient_email: str) -> None:
        self.send_email(EmailBuilder(first_name, recipient_email).build_otp_email(otp))

    def send_resend_otp_email(self, first_name: str, otp: str, recipient_email: str) -> None:
        self.send_email(EmailBuilder(first_name, recipient_email).build_resend_otp_email(otp))

    def send_welcome_email(self, first_name: str, recipient_email: str) -> None:
        self.send_email(EmailBuilder(first_name, recipient_email).build_welcome_email())

    def send_forgot_password_otp(self, first_name: str, otp: str, recipient_email: str) -> None:
        self.send_email(EmailBuilder(first_name, recipient_email).build_forgot_password_otp_email(otp))

    def send_bot_status_notification(self, bot_name: str, recipient_email: str, new_status: str) -> None:
        self.send_email(EmailBuilder(first_name="", recipient_email=recipient_email).build_handle_bot_status_change(bot_name, new_status))

    def send_custom_email(
        self,
        subject: str,
        html: str,
        recipient_email: str,
        body: Optional[str] = None,
        attachments: Optional[List[Tuple[str, bytes]]] = None
    ) -> None:
        builder = EmailBuilder(first_name='', recipient_email=recipient_email).set_custom_email(subject, html)
        if body:
            builder.set_body(body)
        if attachments:
            builder.add_attachments(attachments)
        self.send_email(builder)
