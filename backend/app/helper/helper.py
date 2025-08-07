import json
import os
from typing import Tuple

import faiss
import numpy as np
from faiss import IndexFlatIP
from sentence_transformers import SentenceTransformer

def get_env_variable(key: str, default: str = None) -> str:
    value = os.getenv(key)
    if value is not None:
        print(f"[env] {key} = {value}")
        return value
    else:
        print(f"[env] {key} not found. Using default: {default}")
        return default


def load_faiss_index() -> Tuple[faiss.IndexFlatIP, list]:
    """Load FAISS index and associated data from JSON."""
    rag_json_path = get_env_variable("RAG_JSON_DATA", "app/assets/all_vector_data.json")

    if not os.path.exists(rag_json_path):
        raise FileNotFoundError(f"RAG JSON data file not found: {rag_json_path}")

    with open(rag_json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    embeddings = [item["embedding"] for item in data]
    embeddings = np.array(embeddings).astype("float32")

    dim = embeddings.shape[1]
    index = faiss.IndexFlatIP(dim)
    index.add(embeddings)

    return index, data['content']

def load_embedding_model() -> SentenceTransformer:
    """Load the embedding model name from environment variable."""
    embedding_model_name = get_env_variable("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    embedding_model = SentenceTransformer(embedding_model_name)
    return embedding_model

    