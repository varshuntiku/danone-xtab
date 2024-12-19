import requests
from packaging.specifiers import SpecifierSet
from packaging.version import Version


def is_version_compatible(current_version, comp_versions):
    # Splitting the compatibility specifier by comma and iterating over each condition
    conditions = comp_versions.split(",")
    for condition in conditions:
        # Checking if the current version satisfies the condition
        if not SpecifierSet(condition.strip()).contains(Version(current_version)):
            return False
    return True


def check_package_exist(package_name):
    # Fetching package metadata from PyPI
    response = requests.get(f"https://pypi.org/pypi/{package_name}/json")
    if response.status_code != 200:
        return False, response
    return True, response


def get_python_compatible_versions(package_name, package_version, python_version="3.10"):
    compatible_versions = []
    # Checking Package Exist
    is_package_exist, response = check_package_exist(package_name)
    data = response.json()

    # Extracting version information and checking compatibility with Python 3.10
    if "releases" in data:
        for version, release_info in data["releases"].items():
            for file_info in release_info:
                if "requires_python" in file_info:
                    req = file_info["requires_python"]
                    if req and is_version_compatible(python_version, req):
                        compatible_versions.append(version)
                        break
    is_package_compatible = package_version in compatible_versions
    return is_package_exist, is_package_compatible, compatible_versions
