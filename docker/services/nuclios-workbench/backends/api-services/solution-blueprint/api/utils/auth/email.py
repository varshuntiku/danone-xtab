import logging
import pathlib
import smtplib
from email import encoders
from email.mime.application import MIMEApplication
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List

from api.configs.settings import get_app_settings
from api.constants.users.user_error_messages import UserErrors
from api.middlewares.error_middleware import GeneralException
from api.models.base_models import User
from fastapi import status

settings = get_app_settings()


def generate_otp_mail(code: int, user_data: User) -> None:
    """Generates the email and sends it to the user sharing the otp code

    Args:
        code: otp
        user_data: user object

    Returns:
        None
    """
    try:
        cover_photo_x1 = f"{settings.AZURE_BLOB_ROOT_URL}codex-data-static-assets/forgot_password_x1.png"
        html_path = pathlib.Path(__file__).parent / "../../email-templates/forgot-password.html"
        html_template = open(html_path)
        html = html_template.read().format(
            otp_code=code,
            cover_photo=cover_photo_x1,
            blob_url=settings.AZURE_BLOB_ROOT_URL,
        )
        html_template.close()
        plain_text_path = pathlib.Path(__file__).parent / "../../email-templates/forgot-password.txt"
        plain_text_template = open(plain_text_path)
        plain_text = plain_text_template.read().format(
            user_name=user_data.first_name + " " + user_data.last_name, otp_code=code
        )
        plain_text_template.close()
        mail_subject = "Reset Password"
        send_email_smtp(
            email_type="forgot-password",
            to=[user_data.email_address],
            subject=mail_subject,
            body={"plain": plain_text, "html": html},
        )
    except Exception as e:
        logging.exception(e)
        raise GeneralException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            message={"error": UserErrors.USER_GENERATE_EMAIL_ERROR.value},
        )


def send_email_smtp(
    email_type: str,
    to: List[str] = [],
    subject: str = "",
    cc: List[str] = [],
    bcc: List[str] = [],
    body: dict = {"plain": "", "html": "", "image_list": []},
    from_email_address: str | None = None,
    password: str | None = None,
    server: str = "smtp-mail.outlook.com",
    port: int = 587,
) -> None:
    """Sends the email

    Args:
        email_type: type of email
        to:  list of email addresses to send the email to
        subject: subject of the email
        cc: list of email addresses to cc the email to
        bcc: list of email addresses to bcc the email to
        body: email body
        from_email_address: sender email
        password: sender password
        server: server
        port: port

    Returns:
        None
    """
    try:
        from_email_address = from_email_address or settings.SHARE_EMAIL_SENDER
        password = password or settings.SHARE_EMAIL_PWD
        # inserting the layout
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = from_email_address
        message["To"] = ", ".join(to)
        message["Cc"] = ", ".join(cc)

        image_list = body.get("image_list", False)
        if image_list:
            for image in image_list:
                data = image.get("data", "")
                content = MIMEImage(data, _subtype=image.get("file_type", None))
                content.add_header("Content-ID", "<%s>" % image.get("name", ""))
                message.attach(content)

        files = body.get("files", False)
        if files:
            for file in files:
                payload = MIMEApplication(file.get("data"), Name=file.get("file_name"))
                payload["Content-Disposition"] = 'attachment; filename="%s"' % file.get("file_name")
                encoders.encode_base64(payload)
                message.attach(payload)

        # Turn these into plain/html MIMEText objects
        part1 = MIMEText(body.get("plain", ""), "plain")
        part2 = MIMEText(body.get("html", ""), "html")

        # Add HTML/plain-text parts to MIMEMultipart message
        # The email client will try to render the last part first
        message.attach(part1)
        message.attach(part2)

        # Create secure connection with server and send email
        # Gmail -"smtp.gmail.com", 465
        # outlook -'smtp-mail.outlook.com', 587  call1 | call2 |call3.1,call3.2|call4.1,call4.2
        with smtplib.SMTP(server, port) as server:
            server.ehlo()
            server.starttls()
            server.login(from_email_address, password)
            server.sendmail(from_email_address, to + cc + bcc, message.as_string())

    except Exception as e:
        logging.exception(e)
        raise GeneralException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            message={"error": UserErrors.USER_SEND_EMAIL_ERROR.value},
        )
