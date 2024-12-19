#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

import logging

from api.blueprints.exec_env import bp as exec_env
from api.blueprints.exec_env import (
    create_python_virtual_environment,
    install_venv_packages,
)
from flask import Flask
from flask_cors import CORS
from flask_talisman import Talisman
from widget_factory_lite_module.codex_widget_factory_lite.data_connectors.sql_database import (
    SqlDatabase,
)

# create app
app = Flask(__name__)
CORS(app)

app.config.from_pyfile("config.py", silent=True)
app.config["JWT_ALGORITHM"] = "RS256"
app.config["JWT_PUBLIC_KEY"] = open(app.root_path + "/decode_key.pub").read()
app.config["JWT_ENCODE_ISSUER"] = "codex-backend"


# welcome route
@app.route("/codex-exec-api/")
def welcome():
    return "Welcome to the CODX EXEC ENV !" + "\n"


# import and add blueprints
app.register_blueprint(exec_env)

# enable strict TLS, CSP
csp = {
    "default-src": ["'self'", "'unsafe-inline'"],
    "script-src": ["'self'", "'unsafe-inline'"],
    "style-src": ["'self'", "'unsafe-inline'"],
    "style-src-elem": ["'self'", "https:", "'unsafe-inline'"],
    "img-src": ["'self'", "data:"],
    "font-src": "https://fonts.gstatic.com/  ",
}
Talisman(
    app,
    force_https=app.config.get("HTTPS_FORCE", False),
    frame_options="SAMEORIGIN",
    content_security_policy=csp,
)


# enable CORS for only certain origins
CORS(app, resources={r"/*": {"origins": app.config.get("ALLOWED_ORIGINS", "*")}})

# bring up execution envs on startup
try:
    execution_envs = SqlDatabase(
        connection_string=app.config.get("PRODUCT_SERVER_SQLALCHEMY_DATABASE_URI"),
        schema_name=app.config.get("PRODUCT_SERVER_SCHEMA", ""),
        sql_query='SELECT id, "name", requirements, py_version FROM dynamic_viz_execution_environment where deleted_by is NULL;',
    ).output_df
    for index, row in execution_envs.iterrows():
        try:
            print(
                "###### Installing Environment - {name} {py_version} ######".format(
                    name=row["name"], py_version=row["py_version"]
                )
            )
            (
                pyenv_create_stdout,
                pyenv_create_stderr,
            ) = create_python_virtual_environment(python_version=row["py_version"], environment_name=row["id"])
            if pyenv_create_stderr:
                logging.error("Error creating python environment - " + str(pyenv_create_stderr))
            else:
                # install packages
                (
                    pyenv_package_install_stdout,
                    pyenv_package_install_stderr,
                ) = install_venv_packages(
                    python_version=row["py_version"],
                    environment_name=row["id"],
                    package_list=row["requirements"],
                    root_path=True,
                )
                if pyenv_package_install_stderr:
                    logging.error(
                        "Error installing packages in pyenv environment - " + str(pyenv_package_install_stderr)
                    )
        except Exception as error:
            logging.error("Error creating conda environment - " + row["name"] + str(error))
except Exception as e:
    logging.error("Error creating conda environments during startup - " + str(e))
