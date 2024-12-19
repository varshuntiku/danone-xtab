import numpy as np
from nltk.translate.bleu_score import sentence_bleu
from rouge import Rouge
from sentence_transformers import SentenceTransformer


class test:
    def __init__(self, test_name):
        if test_name == "cosine_similarity":
            model_name = "BAAI/bge-large-en-v1.5"
            self.model = SentenceTransformer(model_name)
        self.tests_dict = {
            "cosine_similarity",
            "exactness_match",
            "rouge_score",
            "bleu_score",
        }
        if test_name not in self.tests_dict:
            raise ValueError(f"{test_name} not supported!")

    def calculate_rouge_score(self, reference, candidate):
        rouge = Rouge()
        scores = rouge.get_scores(candidate, reference)
        return scores

    def calculate_cosine_similarity(self, reference, candidate):
        emb1 = self.model.encode(reference)
        emb2 = self.model.encode(candidate)

        if isinstance(emb1, list):
            emb1 = np.array(emb1)

        if isinstance(emb2, list):
            emb2 = np.array(emb2)

        dot_product = emb1 @ emb2
        magnitude1 = np.linalg.norm(emb1)
        magnitude2 = np.linalg.norm(emb2)
        cosine_similarity = dot_product / (magnitude1 * magnitude2)
        return cosine_similarity

    def calculate_bleu_score(self, reference, candidate):
        reference_tokens = [reference.split()]
        candidate_tokens = candidate.split()
        bleu_score = sentence_bleu(reference_tokens, candidate_tokens)
        return bleu_score

    def calculate_exactness_match(self, reference, candidate):
        return reference == candidate
