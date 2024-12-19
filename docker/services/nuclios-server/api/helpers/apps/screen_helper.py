import os
import pathlib
from importlib.metadata import version

from api.middlewares.error_middleware import GeneralException
from fastapi import status


class ScreenHelper:
    """
    We are reading requirements.py file line by line and applying validations.
    Added comment check.
    Validation for not applicable packages.
    Returning final list of packages and their versions in list of objects format.
    We are using static methods and calling static methods.
    """

    not_applicable_packages = [
        "flask",
        "Flask",
        "pyjwt",
        "gunicorn",
        "opencensus-ext-azure",
        "opencensus-ext-flask",
        "opencv-python-headless",
        "fastapi",
        "uvicorn",
        "starlette",
        "python-dotenv",
        "passlib",
        "alembic",
    ]

    @staticmethod
    def validate_package(package_text):
        #  Checking comments
        if package_text.startswith("#") or package_text.startswith(" #"):
            return False
        # Checking if package_text contains any of not_applicable_packages
        value = any(package in package_text for package in ScreenHelper.not_applicable_packages)
        return not value

    @staticmethod
    def read_file_and_generate_package_list(file, packages):
        with open(file) as reader:
            count = 0
            for line in reader:
                package = {}
                is_package_applicable = ScreenHelper.validate_package(line)  # Calling static method using class
                if is_package_applicable:
                    if " == " in line:
                        # Eliminating \n from the string and splitting
                        line = (line.strip()).split(" == ", 1)
                        package = {"id": count + 1, "title": line[0], "version": line[1]}  # Updating Package Dictionary
                    elif "==" in line:
                        # Eliminating \n from the string and splitting
                        line = (line.strip()).split("==", 1)
                        package = {"id": count + 1, "title": line[0], "version": line[1]}  # Updating Package Dictionary
                    else:
                        # Eliminating \n from the string, splitting and getting version
                        package = {
                            "id": count + 1,
                            "title": line.strip(),
                            "version": version(line.strip()),
                        }  # Updating Package Dictionary
                    if package:
                        packages.append(package)
                        count += 1
        return packages

    @staticmethod
    def get_installed_packages():
        packages = []
        try:
            # Getting file location
            requirement_filename = "requirements" + ".txt"
            requirement_file = os.path.join(
                os.path.dirname(pathlib.Path(__file__).resolve().parent.parent.parent),
                requirement_filename,
            )
            packages = ScreenHelper.read_file_and_generate_package_list(
                requirement_file, packages
            )  # Calling static method using class
        except Exception as error_msg:
            # ExceptionLogger(error_msg)
            raise GeneralException(message=error_msg, status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return packages
