#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.


class CustomException(Exception):
    """CustomException Class
    Will allow to handle the exceptions along with the exception codes

    Args:
        Exception ([type]): [description]
    """

    def __init__(self, message, status_code=500):
        """Constructor

        Args:
            message (string): Error message to be displayed
            status_code (integer): HTTP reponse codes
        """
        self.message = message
        self.code = status_code
        super().__init__(message)

    def __str__(self):
        return super().__str__()
