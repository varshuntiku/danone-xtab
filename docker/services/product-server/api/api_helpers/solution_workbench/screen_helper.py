import os
from importlib.metadata import version

from api.constants.functions import ExceptionLogger
from flask import current_app


class Package:
    """
    Using this class to create Package Object.
    """

    def __init__(self, id, title, version):
        self.id = id
        self.title = title
        self.version = version


class OverviewHelper:
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
    ]

    @staticmethod
    def validate_package(package_text):
        #  Checking comments
        if package_text.startswith("#") or package_text.startswith(" #"):
            return False
        # Checking if package_text contains any of not_applicable_packages
        value = any(package in package_text for package in OverviewHelper.not_applicable_packages)
        return not value

    @staticmethod
    def read_file_and_generate_package_list(file, packages):
        with open(file) as reader:
            count = 0
            for line in reader:
                package = None
                is_package_applicable = OverviewHelper.validate_package(line)  # Calling static method using class
                if is_package_applicable:
                    if " == " in line:
                        # Eliminating \n from the string and splitting
                        line = (line.strip()).split(" == ", 1)
                        package = Package(count + 1, line[0], line[1])  # Creating Package Object
                    elif "==" in line:
                        # Eliminating \n from the string and splitting
                        line = (line.strip()).split("==", 1)
                        package = Package(count + 1, line[0], line[1])  # Creating Package Object
                    else:
                        # Eliminating \n from the string, splitting and getting version
                        package = Package(count + 1, line.strip(), version(line.strip()))  # Creating Package Object
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
                os.path.dirname(current_app.instance_path),
                requirement_filename,
            )
            packages = OverviewHelper.read_file_and_generate_package_list(
                requirement_file, packages
            )  # Calling static method using class
        except Exception as error_msg:
            ExceptionLogger(error_msg)

        return packages
