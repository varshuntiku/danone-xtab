import logging
from typing import Any, Dict, List

import requests
from huggingface_hub import ModelFilter, file_exists, list_models, model_info


def get_open_source_models(
    author: str = None,
    library: str = None,
    language: str = None,
    model_name: str = None,
    task: str = None,
    trained_dataset: str = None,
    tags: List[str] = None,
    load_full_data: bool = False,
    search: str = None,
) -> List[str]:
    """
    Retrieve open-source models for a given filters from HuggingFace Models Hub.

    Parameters:
        author (`str`, *optional*):
            A string that can be used to identify models on the Hub by the
            original uploader (author or organization), such as `facebook` or
            `huggingface`.
        library (`str`, *optional*):
            A string or list of strings of foundational libraries models were
            originally trained from, such as pytorch, tensorflow, or allennlp.
        language (`str`, *optional*):
            A string or list of strings of languages, both by name and country
            code, such as "en" or "English"
        model_name (`str`, *optional*):
            A string that contain complete or partial names for models on the
            Hub, such as "bert" or "bert-base-cased"
        task (`str`, *optional*):
            A string or list of strings of tasks models were designed for, such
            as: "fill-mask" or "automatic-speech-recognition"
        tags (`str` or `List`, *optional*):
            A string tag or a list of tags to filter models on the Hub by, such
            as `text-generation` or `spacy`.
        trained_dataset (`str`, *optional*):
            A string tag or a list of string tags of the trained dataset for a
            model on the Hub.

    Returns:
        List[str]: List of model ids available.

    Examples:
        ```python
        from huggingface_hub_utils import get_open_source_models
        models = get_open_source_models(task="text-generation", author="abc")
        ```
    """
    models = list(
        list_models(
            filter=ModelFilter(
                author=author,
                library=library,
                language=language,
                model_name=model_name,
                task=task,
                trained_dataset=trained_dataset,
                tags=tags,
            )
        )
    )
    models_list = []
    for model in models:
        try:
            if model_info(model.modelId).gated is False:
                models_list.append(model)
            else:
                models_list.append(model.modelId)
        except Exception as e:
            logging.info(f"{e}")
    return models_list


def get_model_size(modelId: str, in_gb: bool = False) -> float:
    """
    Retrieve the size of the open source model.

    Parameters:
        modelId (`str`):
            A string that contain complete names for models on the Hub Such as `author/model-3b`.
        in_gb (`bool`):
            Defaults: `False`
            A boolean value indicating whether the size of the model returned is in Gigabytes(GB) or Megabytes(MB).
            If `True`, the size of the model returned is in Gigabytes(GB)
            If `False`, the size of the model returned is in Megabytes(MB)

    Returns:
        `float`: Size of the specified model

    Examples:
        ```python
        from huggingface_hub_utils import get_model_size
        model_size = get_model_size('author/model-3b', in_gb = True)
        ```
    """
    try:
        bin_file, safetensors_file = 0, 0

        for sibling in model_info(modelId, files_metadata=True).siblings:
            if ".bin" in sibling.rfilename:
                bin_file += sibling.size
            elif ".safetensors" in sibling.rfilename:
                safetensors_file += sibling.size

        model_size = bin_file if bin_file != 0 else safetensors_file

        if in_gb:
            model_size /= 2**30
        else:
            model_size /= 2**20

        return round(model_size, 2)
    except Exception as e:
        logging.info(f"{e}")
        return 0.0


def get_model_tags(modelId: str) -> List[str]:
    """
    Retrives the model tags for a given modelId

    Parameters:
        modelId (`str`):
            A string that contain complete names for models on the Hub Such as `author/model-3b`.

    Returns:
        `list`: List of all model tags for that model

    Examples:
        ```python
        from huggingface_hub_utils import get_model_tags
        tags = get_model_tags("author/model-3b")
        ```
    """
    try:
        return model_info(modelId).tags
    except Exception as e:
        logging.info(f"{e}")
        return []


def get_model_summary(modelId: str, full: bool = True, num_chars: int = 200) -> str:
    """
    Retrives the model summary for a given model

    Parameters:
        modelId (`str`):
            A string that contain complete names for models on the Hub Such as `author/model-3b`.
        full (`bool`):
            Default: `True`
            A boolean parameter indicating whether to return the complete summary or not.
            If `True`, it will return the entire model summary (as given in models repo)
            If `False`, it will return only the initial characters of the summary as provided in `num_chars`
        num_char (`int`):
            Default: `200`
            Maximum number of characters that will be returned if `full` is False.
            This parameter must be given if `full` is False, if not given by default it will return first 200 chars

    Returns:
        `str`: Summary for the given model

    Examples:
        ```python
        from huggingface_hub_utils import get_model_summary
        summary = get_model_summary("author/model-3b", full=True)
        ```
    """
    try:
        response = requests.get(f"https://huggingface.co/{modelId}/resolve/main/README.md")
        if response.status_code == 200:
            summary = response.text
            return summary if full else summary[:num_chars]
        else:
            return "Summary not found"
    except Exception as e:
        logging.info(f"{e}")
        return "Summary not found"


def get_model_stats(modelId: str) -> Dict[str, Any]:
    """
    Retrives the model stats for a given model

    Parameters:
        modelId (`str`):
            A string that contain complete names for models on the Hub Such as `author/model-3b`.

    Returns:
        `dict`: Dictionary of stats with key as stats heading and value as stats

    Example:
        ```python
        from huggingface_hub_utils import get_model_stats
        stats = get_model_stats("author/model-3b")
        ```
    """
    try:
        m_info = model_info(modelId, securityStatus=True, files_metadata=True)
        stats = m_info.__dict__
        return {
            "modelId": stats.get("modelId"),
            "downloads": stats.get("downloads"),
            "likes": stats.get("likes"),
            "pipeline_tag": stats.get("pipeline_tag"),
            "spaces_count": len(stats.get("spaces", [])),
            "no_of_files": len(stats.get("siblings", [])),
        }
    except Exception as e:
        logging.info(f"{e}")
        return {"modelId": modelId}


def readme_file_exists(modelId: str) -> bool:
    """
    Check whether the README.md file exists in the model's repo for a given model

    Parameters:
        modelId (`str`):
            A string that contain complete names for models on the Hub Such as `author/model-3b`.

    Returns:
        `bool`: Return wheter the file exists or not, `True` (yes) or `False` (no).

    Examples:
        ```python
        from huggingface_hub_utils import readme_file_exists
        status = readme_file_exists("author/model-3b")
        ```
    """
    try:
        return file_exists(modelId, filename="README.md")
    except Exception as e:
        logging.info(f"{e}")
        return False


def get_models(sort: str, pipeline_tag: str = "", search: str = None, page: int = 0):
    """
    Fetches list of huggingface models in a paginated way
    """
    try:
        url = f"https://huggingface.co/models-json?pipeline_tag={pipeline_tag}&sort={sort}&p={page}"
        if search:
            url += f"&search={search}"
        response = requests.get(url)
        if response.status_code == 200:
            return response.text
    except Exception as e:
        return e
