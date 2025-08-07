import numpy as np
from nltk.data import retrieve

from app.helper.helper import load_faiss_index, load_embedding_model
from prompt_builder import generate_prompt

class RAGSingleton:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(RAGSingleton, cls).__new__(cls)
            # Load data and models only once
            cls._instance.index, cls._instance.texts = load_faiss_index()
            cls._instance.embedder = load_embedding_model()

        return cls._instance

    def retrieve(self, query, k=3):
        query_vec = self.embedder.encode([query], normalize_embeddings=True)
        D, I = self.index.search(np.array(query_vec).astype('float32'), k)
        return [self.texts[i] for i in I[0]]

    def generate_prompt(self, query):
        context = retrieve(query)
        return generate_prompt(query, context)