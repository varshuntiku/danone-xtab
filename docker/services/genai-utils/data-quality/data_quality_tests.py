import json
import logging
from typing import Optional, Union

import numpy as np
import pandas as pd
import tiktoken
from scipy.stats import entropy

encoding = tiktoken.get_encoding("cl100k_base")


def calculate_token_diversity(text: Union[pd.Series, list], encoding_name: Optional[str] = "cl100k_base") -> float:
    """
    This method calculates token diversity of a given list of text. This uses tiktoken library under the hood.

    Args:
    >>> text:
    >>> encoding_name(str): The name of the encoding to be used. Defaults to cl100k_base

    Returns:
    lecical_score(float): The calculated lexical diversity score
    """
    encoding = tiktoken.get_encoding(encoding_name)
    encoded_list = encoding.encode_batch(list(text))
    total_text = extend(encoded_list)
    lexical_score = np.unique(total_text).shape[0] * 100 / encoding.n_vocab
    return lexical_score


def calulate_text_entropy(
    text: Union[pd.Series, list], encoding_name: Optional[str] = "cl100k_base", base: Optional[float] = None
) -> float:
    """
    This method calculates the entropy  for a given list of text. This uses tiktoken library under the hood.

    Args:
    >>> text:
    >>> encoding_name(str): The name of the encoding to be used. Defaults to cl100k_base
    >>> base(float)

    Returns:
    entropy(float): The calculated entropy
    """
    encoding = tiktoken.get_encoding(encoding_name)
    encoded_list = encoding.encode_batch(list(text))
    total_text = extend(encoded_list)
    norm_entropy = entropy(np.ones(encoding.n_vocab), base=base)
    value, counts = np.unique(total_text, return_counts=True)
    return entropy(counts, base=base) / norm_entropy  # type: ignore


def extend(a):
    out = []
    for sublist in a:
        out.extend(sublist)
    return out


def embedding_duplications(df, embeddings):
    """
    df{pd.DataFrame}: DataFrame with text data only. Should only include columns that need to be concatenated

    Returns:
    >>> json with all the details needed to plot the histogram
    """

    joined_string = df.apply(lambda row: " ".join(map(str, row)), axis=1)

    joined_string.apply(lambda text: embeddings.embed_query(text))
    try:
        matrix = np.array(df.embedding.apply(eval).to_list())
    except Exception as e:
        logging.info(f"{e}")
        matrix = np.array(df.embedding.to_list())
    dist = 1 - matrix @ matrix.T
    n = dist.shape[0]
    dist = np.triu(dist, k=1)
    dist_array = dist[np.triu_indices(n, k=1)]
    mean = np.mean(dist_array)
    std = np.std(dist_array)
    n_bins = np.ptp(dist_array) * (n ** (1 / 3)) / (3.49 * std)  # type: ignore
    count, bins = np.histogram(dist_array, bins=int(np.ceil(n_bins)))
    return {"count": json.dumps(count.tolist()), "bins": json.dumps(bins.tolist()), "mean": mean, "std": std}


def calculate_distances(df: pd.DataFrame):
    try:
        matrix = np.array(df.embedding.apply(eval).to_list())
    except Exception as e:
        logging.info(f"{e}")
        matrix = np.array(df.embedding.to_list())
    dist = 1 - matrix @ matrix.T
    n = dist.shape[0]
    dist = np.triu(dist, k=1)
    dist_array = dist[np.triu_indices(n, k=1)]
    mean = np.mean(dist_array)
    std = np.std(dist_array)
    print(std)
    n_bins = np.ptp(dist_array) * (n ** (1 / 3)) / (3.49 * std)
    count, bins = np.histogram(dist_array, bins=int(np.ceil(n_bins)))
    return mean, std, count, bins


def entropy_tokens(encoding, df, base=None):
    df["text"] = df.apply(lambda x: " ".join(list(x.values)), axis=1)
    df_encoded = encoding.encode_batch(list(df.text.values))
    # token_ids = encoding.encode(total_text)
    total_text = extend(df_encoded)
    norm_entropy = entropy(np.ones(encoding.n_vocab), base=base)
    value, counts = np.unique(total_text, return_counts=True)
    return entropy(counts, base=base) / norm_entropy  # type: ignore
