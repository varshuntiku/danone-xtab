import json
import os
import subprocess
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor, as_completed

from api.configs.settings import get_app_settings

# import threading
from api.constants.execution_environment.variables import CORE_PACKAGES
from api.services.utils.azure.fileshare_service import AzureFileShareService

settings = get_app_settings()
exec_env_repository = settings.EXEC_ENV_REPOSITORY if "EXEC_ENV_REPOSITORY" in settings else "exec-env-repository"
compatible_packages_prefix = (
    settings.COMPATIBLE_PACKAGES_PREFIX
    if "COMPATIBLE_PACKAGES_PREFIX" in settings
    else "compatible_packages/compatible_packages_"
)


def convert_python_version(python_version):
    return str(python_version).replace(".", "_")


def read_cache_packages(python_version="3_10"):
    try:
        compatible_packages_response = AzureFileShareService().get_text_file_data_from_specific_path(
            exec_env_repository, compatible_packages_prefix + convert_python_version(python_version) + ".json"
        )
        if (compatible_packages_response["status"]).lower() == "success":
            return json.loads("".join(compatible_packages_response["data"]))
        else:
            return {}
    except Exception:
        return {}


def update_cache_packages(python_version="3_10", data={}):
    compatible_packages_response = AzureFileShareService().upload_file_as_data_to_specific_path(
        exec_env_repository,
        compatible_packages_prefix + convert_python_version(python_version) + ".json",
        json.dumps(data),
    )
    if (compatible_packages_response["status"]).lower() == "success":
        return "success"
    else:
        return "failed"


def check_compatibility(target_args):
    output, python_version, package_name, package_version, index_url = target_args
    command = [
        "pip",
        "install",
        "--index-url" if index_url else "",
        index_url if index_url else "",
        f"{package_name}=={package_version}",
        "--dry-run",
        # "--python-version",
        # python_version,
        # "--only-binary",
        # ":all:",
        # "--target",
        # "foo",
    ]
    command = [arg for arg in command if arg]
    try:
        subprocess.check_output(command, stderr=subprocess.STDOUT)
        output_ = (False, "", package_version)
        output.append(output_)
        return output_

    except subprocess.CalledProcessError as e:
        output_ = (True, e.output.decode(), package_version)
        output.append(output_)
        return output_


def compatible_version_in_cache(compatible_version, current_package_cache):
    if (
        compatible_version in current_package_cache["compatible_versions"]
        or compatible_version in current_package_cache["non_compatible_versions"]
    ):
        return True
    return False


def process_approach(python_version, package_name, compatible_versions, current_package_cache, output_=[], index_url=""):
    # find opimal max workers
    max_workers = (os.cpu_count() * 2) or 5
    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        future_results = []
        print(compatible_versions)
        for compatible_version in compatible_versions:
            if compatible_version_in_cache(compatible_version, current_package_cache):
                continue
            future_results.append(
                executor.submit(check_compatibility, ([], python_version, package_name, compatible_version, index_url))
            )
        for future in as_completed(future_results):
            try:
                otp = future.result()
                if otp:
                    output_.append(otp)
            except Exception as e:
                print(e)
    return output_


def thread_approach(python_version, package_name, compatible_versions, current_package_cache, output_=[]):
    # find opimal max workers
    target_args = []
    for compatible_version in compatible_versions:
        if compatible_version_in_cache(compatible_version, current_package_cache):
            continue
        target_args.append((output_, python_version, package_name, compatible_version))
    if target_args:
        max_workers = (os.cpu_count() * 2) or 5
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            list(executor.map(check_compatibility, target_args))
    return output_


def pip_version_check(package_name, package_version, python_version="3.11", data_from_cache={}, index_url=""):
    # output = []
    error, message, pkg_version = check_compatibility(([], python_version, package_name, "", index_url))
    # error, message, pkg_version = output[0]
    try:
        extract = message.split("from versions: ")[1].split("\r\n")[0]
        compatible_versions_org = extract.split(")")[0].split(", ")
        if "none" in compatible_versions_org:
            compatible_versions_org.remove("none")
        if not compatible_versions_org:
            return False, False, [], []
        # target_args = []
        output_ = []
        compatible_versions = compatible_versions_org.copy()
        # for compatible_version in compatible_versions:
        #     target_args.append((output_, python_version, package_name, compatible_version))

        # with ProcessPoolExecutor(max_workers=20) as executor:
        #     results = list(executor.map(check_compatibility, target_args))
        current_package_cache = data_from_cache.get(
            package_name, {"compatible_versions": [], "non_compatible_versions": []}
        )
        try:
            output_ = process_approach(
                python_version, package_name, compatible_versions, current_package_cache, output_, index_url
            )
        except Exception:
            output_ = thread_approach(python_version, package_name, compatible_versions, current_package_cache, output_)

        actual_compatible_versions = [x[2] for x in output_ if (x and not x[0])]
        compatible_versions = current_package_cache["compatible_versions"] + actual_compatible_versions
        is_package_exist = True if compatible_versions else False
        is_package_compatible = True if package_version in compatible_versions else False
        non_compatible_versions = [x for x in compatible_versions_org if x not in compatible_versions]
        return is_package_exist, is_package_compatible, compatible_versions, non_compatible_versions
    except Exception:
        return False, False, [], []


# is_package_exist, is_package_compatible, compatible_versions = pip_version_check("pyarrow", "7.0.0")
# pip_version_check("pyarrow", "7.0.0")


def pip_version_check_helper(target_args):
    is_package_exist, is_package_compatible, compatible_versions, non_compatible_versions = pip_version_check(
        *target_args
    )
    return {
        "is_package_exist": is_package_exist,
        "is_package_compatible": is_package_compatible,
        "compatible_versions": compatible_versions,
        "non_compatible_versions": non_compatible_versions,
        "name": target_args[0],
        "version": target_args[1],
    }


def add_error_message(python_version, compatible_packages_output):
    errors = []
    for package in compatible_packages_output:
        if package["name"] in CORE_PACKAGES:
            errors.append(
                {
                    "message": "Core packages cannot be updated.",
                    "error": "not_allowed",
                    "package": package["name"],
                }
            )
        else:
            if not package["is_package_exist"]:
                # package not found on PyPI
                errors.append(
                    {
                        "message": "Package not found on PyPI, please verify if package name is correct",
                        "error": "not_found",
                        "package": package["name"],
                    }
                )
            elif not package["is_package_compatible"]:
                # error in fetching package metadata
                errors.append(
                    {
                        "message": f"Package is not compatible with Python {python_version}",
                        "package": package["name"],
                        "error": "not_compatible",
                        "compatible_versions": package["compatible_versions"],
                    }
                )
    if errors:
        return {
            "status": "error",
            "errors": errors,
        }
    return {
        "status": "success",
        "errors": [],
    }


def package_validation(python_version, packages, index_url=None):
    target_args = []
    output = []
    data_from_cache = read_cache_packages(python_version)
    cache_packages = []
    dry_run_packages = []
    for package in packages:
        package_name = package["name"]
        package_version = package["version"]
        if package.get("type", "") == "url" or package_version == "custom_package_url":
            cache_packages.append(
                {
                    "is_package_exist": True,
                    "is_package_compatible": True,
                    "compatible_versions": ["custom_package_url"],
                    "non_compatible_versions": [],
                    "name": package_name,
                    "version": package_version,
                }
            )
            continue
        current_package_cache = data_from_cache.get(
            package_name, {"compatible_versions": [], "non_compatible_versions": []}
        )
        if compatible_version_in_cache(package_version, current_package_cache):
            cache_packages.append(
                {
                    "is_package_exist": True,
                    "is_package_compatible": package_version in current_package_cache["compatible_versions"],
                    "compatible_versions": current_package_cache["compatible_versions"],
                    "non_compatible_versions": current_package_cache["non_compatible_versions"],
                    "name": package_name,
                    "version": package_version,
                }
            )
            continue
        if package_name in CORE_PACKAGES:
            cache_packages.append(
                {
                    "is_package_exist": True,
                    "is_package_compatible": True,
                    "compatible_versions": [],
                    "non_compatible_versions": [],
                    "name": package_name,
                    "version": package_version,
                }
            )
            continue
        target_args.append((package_name, package_version, python_version, data_from_cache, index_url))

    if target_args:
        with ThreadPoolExecutor(max_workers=20) as executor:
            output = list(executor.map(pip_version_check_helper, target_args))
        dry_run_packages = output
        for package in dry_run_packages:
            if package["is_package_exist"]:
                data_from_cache[package["name"]] = {
                    "compatible_versions": package["compatible_versions"],
                    "non_compatible_versions": package["non_compatible_versions"],
                }
        update_cache_packages(python_version, data_from_cache)
    actual_output = cache_packages + dry_run_packages
    return add_error_message(python_version, actual_output)


# if __name__ == "__main__":
#     requirements_file = "./requirements.txt"
#     file_cont = open(requirements_file, "r").read()
#     split_lines = file_cont.split("\n")
#     default_dependencies = {}
#     for each in split_lines:
#         if each not in ["", " ", None] and not each.startswith("#"):
#             if "==" in each:
#                 splitted_value = each.split("==")
#                 default_dependencies[splitted_value[0]] = splitted_value[1]
#             else:
#                 default_dependencies[each] = ""
#     default_dependencies_list = list(default_dependencies.items())[:2]
#     packages = []
#     for package_name, package_version in default_dependencies_list:
#         packages.append({
#             "package_name": package_name,
#             "package_version": package_version
#         })
#     print(package_validation("3.11", packages))
