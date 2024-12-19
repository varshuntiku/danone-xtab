import ast

from api.utils.restricted_packages import RESTRICTED_PACKAGES


class UiacError(Exception):
    def __init__(self, error=[], warning=[]):
        self.error = error
        self.warning = warning


def validate_uiac_code(code):
    try:
        # Inspection of imports
        vulneraility_validator(code)

        # Code syntax inspection
        # code_syntax_validator(code)

    except Exception as ex:
        raise ex


def vulneraility_validator(code):
    error = []
    try:
        for name in iter_imported_module_names(code):
            if not can_be_imported(name):
                error.append(
                    {
                        "type": "Restricted_Package",
                        "message": "{} module cannot be imported.".format(name),
                    }
                )

        if len(error):
            raise UiacError(error)

    except Exception as error_msg:
        raise error_msg


def can_be_imported(name):
    try:
        # imp.find_module(name)
        if name not in RESTRICTED_PACKAGES:
            return True
    except ImportError:
        return False


def iter_nodes_by_type(code, type):
    for node in ast.walk(code):
        if isinstance(node, type):
            yield node


def iter_imported_module_names(code):
    for node in iter_nodes_by_type(code, ast.Import):
        for alias in node.names:
            yield alias.name
    for node in iter_nodes_by_type(code, ast.ImportFrom):
        yield node.module
