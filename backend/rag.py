import os
import json
import math
from typing import List, Dict, Any, Tuple
import numpy as np
from openai import OpenAI
import faiss

class RAGIndex:
    def __init__(self, entries: List[Dict[str, Any]]) -> None:
        self.entries = entries
        self.emb_dim = None
        self.index = None
        self.matrix = None

    def _client(self) -> OpenAI:
        return OpenAI(base_url=os.getenv("OPENAI_API_BASE"), api_key=os.getenv("OPENAI_API_KEY"))

    def _embed(self, texts: List[str]) -> np.ndarray:
        client = self._client()
        model = os.getenv("EMBED_MODEL", "text-embedding-3-small")
        res = client.embeddings.create(model=model, input=texts)
        vecs = [np.array(d.embedding, dtype=np.float32) for d in res.data]
        arr = np.vstack(vecs)
        norms = np.linalg.norm(arr, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        arr = arr / norms
        return arr

    def build(self) -> None:
        guidelines = [e["guideline"] for e in self.entries]
        try:
            mat = self._embed(guidelines)
        except Exception:
            mat = self._fallback_embed(guidelines)
        self.emb_dim = mat.shape[1]
        self.matrix = mat
        self.index = faiss.IndexFlatIP(self.emb_dim)
        self.index.add(mat)

    def _fallback_embed(self, texts: List[str]) -> np.ndarray:
        vocab: Dict[str, int] = {}
        for t in texts:
            for w in t.lower().split():
                if w not in vocab:
                    vocab[w] = len(vocab)
        dim = len(vocab)
        mat = np.zeros((len(texts), dim), dtype=np.float32)
        for i, t in enumerate(texts):
            for w in t.lower().split():
                mat[i, vocab[w]] += 1.0
        norms = np.linalg.norm(mat, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        mat = mat / norms
        return mat

    def retrieve(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        if self.index is None:
            self.build()
        try:
            qv = self._embed([query])
        except Exception:
            qv = self._fallback_embed([query])
            if qv.shape[1] != self.matrix.shape[1]:
                pad = self.matrix.shape[1] - qv.shape[1]
                if pad > 0:
                    qv = np.pad(qv, ((0, 0), (0, pad)))
                else:
                    qv = qv[:, : self.matrix.shape[1]]
            norms = np.linalg.norm(qv, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            qv = qv / norms
        D, I = self.index.search(qv, k=min(top_k, len(self.entries)))
        out = []
        for idx in I[0]:
            e = self.entries[idx]
            out.append(e)
        return out

def load_guidelines(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)

def embed_documents(index: RAGIndex) -> None:
    index.build()

def retrieve_context(index: RAGIndex, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
    return index.retrieve(query, top_k=top_k)
