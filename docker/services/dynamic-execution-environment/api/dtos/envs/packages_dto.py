from api.constants.execution_environment.variables import CORE_PACKAGES


class PackagesListDTO:
    def __init__(
        self, packages_list, core_packages=CORE_PACKAGES, tag_core_packages=False, exclude_core_packages=False
    ):
        packages_list_local = packages_list
        if core_packages:
            if exclude_core_packages:
                packages_list_local = [
                    package for package in packages_list_local if package["name"] not in core_packages
                ]
            if tag_core_packages:
                for package in packages_list_local:
                    if package["name"] in core_packages:
                        package["is_core"] = True
                    else:
                        package["is_core"] = False
        self.response = {
            "packages": packages_list_local,
        }

    def __getitem__(self, key):
        "We will update this to return dict format."
        pass
