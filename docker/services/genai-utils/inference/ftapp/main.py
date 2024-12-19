import json

from utils import deploy_sh


def main():
    config_file_path = "/eval/deploy_config.json"
    shell_path = "deployment.sh"
    with open(config_file_path, "r") as file:
        config = json.load(file)

    deploy_sh(sh_file_path=shell_path, config=config)


if __name__ == "__main__":
    main()
