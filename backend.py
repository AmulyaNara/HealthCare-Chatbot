from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
import pickle, faiss
from sentence_transformers import SentenceTransformer
import openai
INDEX_PATH = "faiss_index/index.faiss"
EMB_PATH = "faiss_index/emb.pkl"
MODEL_NAME = "all-MiniLM-L6-v2"
embedder = SentenceTransformer(MODEL_NAME)

index = faiss.read_index(INDEX_PATH)
with open(EMB_PATH, "rb") as f:
    texts, metadata = pickle.load(f)

openai.api_key = "YOUR_OPENAI_API_KEY"

app = FastAPI()

class Query(BaseModel):
    query: str

@app.post("/query")
async def query_pdf(q: Query):
    q_emb = embedder.encode([q.query], convert_to_numpy=True)
    D, I = index.search(q_emb, 3)
    context_chunks = [texts[idx] for idx in I[0]]

    context = "\n".join(context_chunks)

    prompt = f"Answer using only the context below:\n\n{context}\n\nQuestion: {q.query}\nAnswer:"

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}],
            max_tokens=250
        )
        answer = response["choices"][0]["message"]["content"]
    except:
        answer = "⚠️ LLM error (check API key)."

    return {"answer": answer}
@app.get("/")
async def home():
    return {"message": "Backend is running!"}

    
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
    
