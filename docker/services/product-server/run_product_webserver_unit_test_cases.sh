#
# Author: Codx Core DEV Team
# TheMathCompany, Inc. (c) 2021
#
# This file is part of Codx.
#
# Codx can not be copied and/or distributed without the express permission of TheMathCompany, Inc.

echo "CODEX >>>Product Server Unit Test Cases Are Running"

cd tests
# pytest
# coverage run -m pytest
# coverage report
# coverage run -m pytest --junitxml=codx_product_server_unit_tests_results.xml
# coverage report
# coverage xml
coverage run -m pytest --junitxml=codx_platform_server_unit_tests_results.xml && coverage report --show-missing && coverage html

cd ..

echo "CODEX >>> Product Server Unit Test Cases Are Done"

