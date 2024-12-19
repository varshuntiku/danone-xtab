# Installing the `codex_widget_factory_lite` Module with Pip

To install the `codex_widget_factory_lite` module, please follow these steps:

## Option 1: Custom Installation

1. **Checkout the Codex Repository and Branch**
   - Navigate to the Codex repository and switch to the `codex_widget_factory_lite/builds` branch.

2. **Copy the `pyproject.toml` File** (Optional)
   - Only perform this step if there is no `pyproject.toml` file in your project. Copy `docker/services/execution/widget_factory_lite_module/pyproject.toml` to your project in the same directory path.

3. **Install Poetry** (Optional)
   - If Poetry is not installed on your system, you can install it by following the instructions [here](https://python-poetry.org/docs/), or by using the following command:
     ```bash
     curl -sSL https://install.python-poetry.org | python3 -
     ```
   - After installation, add Poetry to your PATH:
     ```bash
     export PATH=$PATH:$HOME/.poetry/bin
     ```
   - Verify the installation:
     ```bash
     poetry --version
     ```

4. **Create the Wheel File**
   ```bash
   cd docker/services/execution/widget_factory_lite_module
   poetry install
   poetry build
   ```

5. **Install the Wheel File**
   - The commands above will generate a wheel file in the `dist` folder. You can install this file directly in your project or upload it to private blob storage for later installation.

## Option 2: Install from Nuclios Private Repository

Note that this might not be the latest version and also may not include your custom changes. This option is only recommended for testing purposes.

```bash
pip install "https://stcodxllm.blob.core.windows.net/codex-widget-factory-lite-builds/codex_widget_factory_lite-1.0.0-py3-none-any.whl?sp=r&st=2024-10-11T07:16:05Z&se=2027-10-11T15:16:05Z&spr=https&sv=2022-11-02&sr=b&sig=CNQ2p47eNDo835Xv3OXKvMGOK2P4U8ry0Ld8QcqqqYY%3D"
```

Alternatively, you can add the following line to your `requirements.txt` file:

```
https://stcodxllm.blob.core.windows.net/codex-widget-factory-lite-builds/codex_widget_factory_lite-0.0.1-py3-none-any.whl?sp=r&st=2024-09-18T15:59:34Z&se=2028-09-18T23:59:34Z&spr=https&sv=2022-11-02&sr=b&sig=3wMq31lCCweWoHPEebnhdDEO8FUKR1sOQ5Y6bIaapK0%3D
```