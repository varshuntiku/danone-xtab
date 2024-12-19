from app.utils import generate_eval_sh, load_config_from_json


def main():
    config_file_path = "/eval/config.json"
    eval_path = "/eval_model.sh"

    config = load_config_from_json(config_file_path)
    generate_eval_sh(eval_file_path=eval_path, config=config)


if __name__ == "__main__":
    main()
