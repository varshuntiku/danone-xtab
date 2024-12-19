How to run test cases?
1. in your .vscode folder add the following settings in setting.json. if existing settings are there then just add each of the settings instead of the whole object.

   ```json
   {
       "python.testing.autoTestDiscoverOnSaveEnabled": true,
        "python.testing.pytestEnabled": true,
        "python.testing.pytestArgs": [
            "./docker/services/product-server/",
            "./docker/services/server/",
            "*_unit_test.py"
        ],
    }
   ```


2. There are two ways to run the test cases:
   1. From the Terminal:
        - run the test cases
        ```
        cd /docker/services/product-server
        pytest
        ```
        - run the coverage report
        ```
        coverage run -m pytest
        coverage report
        ```
   2. From VS code Testing Menu in Activity Bar:
        - Put the settings mentioned above in settings.json
        - In Testing section you will see a list of test cases available. Run test cases from there.
        - [image](https://themathcompany-my.sharepoint.com/:i:/p/biswajeet_mishra/EcrRDY7m0lhFikiwi_Ju7rQBTjqxFRRgVi49ZrzxKM7NyQ?e=qC4ozA)
