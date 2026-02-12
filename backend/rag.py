from http import client
import os
import json
import math
from typing import List, Dict, Any, Tuple
from xmlrpc import client 
from xml.parsers.expat import model
import numpy as np
from openai import OpenAI
import faiss

class RAGIndex:
    def __init__(self, entries: List[Dict[str, Any]]) -> None:
        self.entries = entries
        self.emb_dim = None
        self.index = None
        self.matrix = None
        self.vocab = None

    def _client(self) -> OpenAI:
        key = os.getenv("OPENAI_API_KEY")
        base = os.getenv("OPENAI_API_BASE")
        if base:
            return OpenAI(base_url=base, api_key=key)
        return OpenAI(api_key=key)

    def _norm_texts(self, texts: List[str]) -> List[str]:
        out = []
        for t in texts:
            t = t.lower()
            t = "".join(ch if ch.isalnum() or ch.isspace() else " " for ch in t)
            t = " ".join(t.split())
            out.append(t)
        return out

    def _embed(self, texts: List[str]) -> np.ndarray:
        texts = self._norm_texts(texts)
        client = self._client()
        model = os.getenv("EMBED_MODEL", "text-embedding-3-large")  # ← updated default
        dimensions = 1024  # ← add this line (or 1536 / 512 for testing)

        res = client.embeddings.create(
            model=model,
            input=texts,
            dimensions=dimensions if model == "text-embedding-3-large" else None  # only large supports this
        )
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
            mat = self._fallback_build(guidelines)
        self.emb_dim = mat.shape[1]
        self.matrix = mat
        self.index = faiss.IndexFlatIP(self.emb_dim)
        self.index.add(mat)

    def _fallback_build(self, texts: List[str]) -> np.ndarray:
        vocab: Dict[str, int] = {}
        for t in self._norm_texts(texts):
            for w in t.split():
                if w not in vocab:
                    vocab[w] = len(vocab)
        self.vocab = vocab
        dim = len(vocab)
        mat = np.zeros((len(texts), dim), dtype=np.float32)
        for i, t in enumerate(self._norm_texts(texts)):
            for w in t.split():
                mat[i, vocab[w]] += 1.0
        norms = np.linalg.norm(mat, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        mat = mat / norms
        return mat

    def _fallback_embed(self, texts: List[str]) -> np.ndarray:
        texts = self._norm_texts(texts)
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
            if self.vocab is None:
                # Build vocab from entries if missing
                self._fallback_build([e["guideline"] for e in self.entries])
            # Embed query using the stored vocab to align dimensions
            dim = len(self.vocab)
            qv = np.zeros((1, dim), dtype=np.float32)
            for w in self._norm_texts([query])[0].split():
                idx = self.vocab.get(w)
                if idx is not None:
                    qv[0, idx] += 1.0
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
