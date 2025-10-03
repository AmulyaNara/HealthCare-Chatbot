import os
import faiss
import pickle
from sentence_transformers import SentenceTransformer

# Ensure folder exists
os.makedirs("faiss_index", exist_ok=True)

# Your document chunks
texts = [
    "This is text chunk 1",
    "This is text chunk 2",
    "Another chunk of text"
]

# Model
MODEL_NAME = "all-MiniLM-L6-v2"
embedder = SentenceTransformer(MODEL_NAME)
embeddings = embedder.encode(texts, convert_to_numpy=True)

# Create FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)

# Save index and embeddings
faiss.write_index(index, "faiss_index/index.faiss")
with open("faiss_index/emb.pkl", "wb") as f:
    pickle.dump((texts, None), f)

print("FAISS index and embeddings generated successfully!")
