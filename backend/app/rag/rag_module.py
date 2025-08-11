import numpy as np
from nltk.data import retrieve
from sentence_transformers import SentenceTransformer

from app.rag.promp_builder import generate_prompt
from app.helpers import helpers
from app.constant import index_path, metadata_path
import os

class RAGSingleton:
    _instance = None

    def __new__(cls, index, metadata):
        if cls._instance is None:
            cls._instance = super(RAGSingleton, cls).__new__(cls)
            # Load data and models only once
            cls._instance.index = index
            cls._instance.metadata = metadata
            cls._instance.embedder = SentenceTransformer("all-MiniLM-L6-v2")

        return cls._instance

    def retrieve(self, query, k=3):
        query_vec = self.embedder.encode([query], normalize_embeddings=True)
        D, I = self.index.search(np.array(query_vec).astype('float32'), k)
        
        # Defensive: filter out invalid indices (-1)
        retrieved_contexts = []
        for i in I[0]:
            if i != -1 and i < len(self.metadata):
                retrieved_contexts.append(self.metadata[i]["content"])
            else:
                print(f"Warning: index {i} out of bounds or invalid")
        
        full_context = " ".join(retrieved_contexts)
        return full_context

    def generate_prompt(self, query):
        context = self.retrieve(query)
        return generate_prompt(query, context) 

metadata = helpers.load_metadata(metadata_path)
index = helpers.load_faiss_index(index_path)

rag = RAGSingleton(index, metadata)
        