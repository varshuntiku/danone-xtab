#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import os

from flask import current_app, json, jsonify


class CodexEnvParams:
    def __init__(self, app=None):
        if app is None:
            self.app = app
        else:
            self.app = current_app
        self.accessed = []

    def getEnvParam(self, param_key):
        """Returns the configuration or connection parameters of the application in config file

        Args:
            param_key ([type]): [description]

        Returns:
            string: connection strings
        """
        if self.app.config[param_key]:
            self.accessed.append(param_key)
            return self.app.config[param_key]
        elif os.environ.get(param_key):
            self.accessed.append(param_key)
            return os.environ.get(param_key)
        else:
            return False

    def getAllAccessedParams(self):
        """Returns list of all the connection parameters

        Returns:
            string: connection strings
        """
        response = ""
        accesed_set = set(self.accessed)
        for accessed_item in list(accesed_set):
            response += accessed_item + ": " + os.environ.get(accessed_item) + "\n"

        return response


def get_clean_postdata(request):
    response = jsonify(json.loads(request.data))

    return response.json
