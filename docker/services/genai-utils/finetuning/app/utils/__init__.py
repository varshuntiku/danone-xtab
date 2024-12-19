from .adapter_list import Adapter  # type: ignore
from .checkpoint_infer import base_infer  # type: ignore
from .generate_sh_helper import generate_eval_sh  # type: ignore
from .generate_sh_helper import generate_sh  # type: ignore
from .generate_sh_helper import generate_shell_script  # type: ignore
from .generate_sh_helper import load_config_from_json  # type: ignore
from .helper import split  # type: ignore


def dummy_lint_issue_remover():
    Adapter()
    base_infer(config=None)
    generate_eval_sh(eval_file_path=None, config=None)
    generate_sh(None, None)
    generate_shell_script(None)
    load_config_from_json(None)
    split(None, None)
