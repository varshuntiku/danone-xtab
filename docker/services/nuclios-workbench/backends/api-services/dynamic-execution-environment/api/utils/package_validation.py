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


def get_python_compatible_versions(package_name, python_version="3.10"):
    # Fetching package metadata from PyPI
    response = requests.get(f"https://pypi.org/pypi/{package_name}/json")
    if response.status_code != 200:
        return "Package not found on PyPI, please verify if package name is correct", []

    data = response.json()

    # Extracting version information and checking compatibility with Python 3.10
    compatible_versions = []
    if "releases" in data:
        for version, release_info in data["releases"].items():
            for file_info in release_info:
                if "requires_python" in file_info:
                    req = file_info["requires_python"]
                    if req and is_version_compatible(python_version, req):
                        compatible_versions.append(version)
                        break
    return False, compatible_versions


def pip_version_check(package_name, package_version, python_version="3.10"):
    error, compatible_versions = get_python_compatible_versions(package_name, python_version)
    if error:
        return error, None, compatible_versions
    if package_version in compatible_versions:
        return False, package_version, compatible_versions
    return (
        f"Provided version is not compatible with Python {python_version}, also check if package name is correct.",
        None,
        compatible_versions,
    )


# error, compatible_version, compatible_versions = pip_version_check("pandas", "1.3.3")
# if error and not compatible_versions:
#     # package not found on PyPI
#     print(error)
# elif error and compatible_versions:
#     # error in fetching package metadata
#     print(error)
#     print(compatible_versions)
# else:
#     # package found on PyPI
#     print(compatible_version)
#     print(compatible_versions)
