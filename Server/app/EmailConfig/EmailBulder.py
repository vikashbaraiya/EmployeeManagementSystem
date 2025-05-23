from typing import List, Optional, Tuple, Dict
from app.EmailConfig.EmailTemplate import EmailTemplate


class EmailBuilder:
    def __init__(self, first_name: str, recipient_email: str):
        self.first_name: str = first_name
        self.recipient_email: str = recipient_email
        self.subject: str = ""
        self.html: str = ""
        self.body: Optional[str] = None
        self.attachments: Optional[List[Tuple[str, bytes]]] = None

    def build_otp_email(self, otp: str) -> 'EmailBuilder':
        self.subject = "Your OTP Code"
        self.html = EmailTemplate.generate_otp_template(self.first_name, otp)
        return self

    def build_resend_otp_email(self, otp: str) -> 'EmailBuilder':
        self.subject = "Resend Your OTP Code"
        self.html = EmailTemplate.generate_resend_otp_template(self.first_name, otp)
        return self

    def build_welcome_email(self) -> 'EmailBuilder':
        self.subject = "Welcome to Cognitiv.AI!"
        self.html = EmailTemplate.generate_welcome_template(self.first_name)
        return self

    def build_forgot_password_otp_email(self, otp: str) -> 'EmailBuilder':
        self.subject = "Your OTP Code"
        self.html = EmailTemplate.generate_otp_forgot_password(self.first_name, otp)
        return self

    def build_handle_bot_status_change(self, bot_name: str, new_status: str) -> 'EmailBuilder':
        self.subject = "Bot Status Changed"
        self.html = EmailTemplate.generate_bot_status_change_email(bot_name, new_status)
        return self

    def set_custom_email(self, subject: str, html: str) -> 'EmailBuilder':
        self.subject = subject
        self.html = html
        return self

    def set_body(self, body: str) -> 'EmailBuilder':
        self.body = body
        return self

    def add_attachments(self, attachments: List[Tuple[str, bytes]]) -> 'EmailBuilder':
        self.attachments = attachments
        return self

    def get_email_content(self) -> Dict[str, Optional[str]]:
        return {
            'subject': self.subject,
            'html': self.html,
            'body': self.body,
            'attachments': self.attachments,
        }
