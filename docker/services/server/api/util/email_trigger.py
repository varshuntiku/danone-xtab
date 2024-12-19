#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import smtplib
from email import encoders
from email.mime.application import MIMEApplication

# from email.mime.base import MIMEBase
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from api.constants.functions import ExceptionLogger
from flask import current_app

# from python_http_client import exceptions
# from sendgrid import SendGridAPIClient
# from sendgrid.helpers.mail import Mail

# from api.models import (EmailRecord, EmailStatus)

# sender_email = current_app.config['SHARE_EMAIL_SENDER']
# pwd = current_app.config['SHARE_EMAIL_PWD']

smtp_server = "smtp-mail.outlook.com"
smtp_port = 587

# smtp_server = "smtp.gmail.com"
# smtp_port = 465


_body = {"plain": "", "html": "", "image_list": []}


def send_email_smtp(
    email_type,
    To=[],
    Subject="",
    Cc=[],
    Bcc=[],
    body=_body,
    From=None,
    password=None,
    server=smtp_server,
    port=smtp_port,
):
    try:
        From = From or current_app.config["SHARE_EMAIL_SENDER"]
        password = password or current_app.config["SHARE_EMAIL_PWD"]
        # inserting the layout
        message = MIMEMultipart("alternative")
        message["Subject"] = Subject
        message["From"] = From
        message["To"] = ", ".join(To)
        message["Cc"] = ", ".join(Cc)

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
            server.login(From, password)
            server.sendmail(From, To + Cc + Bcc, message.as_string())

    except Exception as ex:
        ExceptionLogger(ex)
        raise ex


# Disabling sendgrid as part of CDD-1932 for now
# def send_email(
#     email_type,
#     To=[],
#     Subject="",
#     Cc=[],
#     Bcc=[],
#     body=_body,
#     From=None,
#     password=None,
#     server=smtp_server,
#     port=smtp_port,
# ):
#     """Sends a customized mail to the given email addresses

#     Args:
#         email_type ([type]): [description]
#         To (list, optional): [description]. Defaults to [].
#         Subject (str, optional): [description]. Defaults to "".
#         Cc (list, optional): [description]. Defaults to [].
#         Bcc (list, optional): [description]. Defaults to [].
#         body ([type], optional): [description]. Defaults to _body.
#         From ([type], optional): [description]. Defaults to None.
#         password ([type], optional): [description]. Defaults to None.
#         server ([type], optional): [description]. Defaults to smtp_server.
#         port ([type], optional): [description]. Defaults to smtp_port.

#     Raises:
#         ex: [description]
#         ex: [description]
#     """
#     From = From or current_app.config["SENDGRID_EMAIL_SENDER"]
#     message = Mail(
#         from_email=From,
#         to_emails=To,
#         subject=Subject,
#         html_content=body.get("html", ""),
#         plain_text_content=body.get("plain", ""),
#     )
#     message.cc = Cc
#     message.bcc = Bcc

#     # personalization = {
#     #     "cc": [{"email": el} for el in Cc],
#     #     "bcc": [{"email": el} for el in Bcc],
#     #     "to": [{"email": el} for el in To]
#     # }
#     # message.add_personalization(personalization)
#     try:
#         sg = SendGridAPIClient(current_app.config["SENDGRID_API_KEY"])
#         response = sg.send(message)
#         logging.info(response.status_code)
#         logging.info(response.body)
#         logging.info(response.headers)
#         if response.status_code == 202:
#             raise CustomException(
#                 "Sendgrid accepted response", 202
#             )
#     except exceptions.BadRequestsError as ex:
#         logging.error(ex.body)
#         raise ex
#     except exceptions.UnauthorizedError as e:
#         error_details = e.to_dict.get('errors', False)[0]
#         if e.status_code == 401 and error_details['message'] == 'Maximum credits exceeded':
#             raise e
#     except CustomException as cex:
#         if cex.code == 202 and cex.message == 'Sendgrid accepted response':
#             raise cex
#     except Exception as ex:
#         ExceptionLogger(ex)
#         raise ex

# Disabling sendgrid as part of CDD-1932 for now
# def send_email_via_sendgrid(data, _from, api_key=None):
#     """Sends a customized mail to the given email addresses

#     Args:
#         data ([type]): [description]
#         _from ([type]): [description]

#     Raises:
#         ex: [description]
#     """
#     try:
#         sg = SendGridAPIClient(
#             api_key=api_key if api_key else current_app.config["SENDGRID_API_KEY"]
#         )
#         # data = {
#         #     "personalizations": [
#         #         {
#         #         "to": [
#         #             {
#         #             "email": "test@example.com"
#         #             }
#         #         ],
#         #         "subject": "Sending with SendGrid is Fun"
#         #         }
#         #     ],
#         #     "from": {
#         #         "email": "test@example.com"
#         #     },
#         #     "content": [
#         #         {
#         #         "type": "text/plain",
#         #         "value": "and easy to do anywhere, even with Python"
#         #         }
#         #     ]
#         # }
#         data["from"] = (
#             _from if _from else {"email": current_app.config["SENDGRID_EMAIL_SENDER"]}
#         )
#         response = sg.client.mail.send.post(request_body=data)
#         logging.info(response.status_code)
#         logging.info(response.body)
#         logging.info(response.headers)
#         if response.status_code == 202:
#             raise CustomException(
#                 "Sendgrid accepted response", 202
#             )
#     except exceptions.BadRequestsError as e:
#         logging.error(e.body)
#     except exceptions.UnauthorizedError as e:
#         error_details = e.to_dict.get('errors', False)[0]
#         if e.status_code == 401 and error_details['message'] == 'Maximum credits exceeded':
#             raise e
#     except CustomException as cex:
#         if cex.code == 202 and cex.message == 'Sendgrid accepted response':
#             raise cex
#     except Exception as ex:
#         ExceptionLogger(ex)
#         raise ex
