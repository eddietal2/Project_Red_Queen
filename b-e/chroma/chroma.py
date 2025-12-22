import chromadb
import os
from dotenv import load_dotenv

load_dotenv()

client = chromadb.CloudClient(
    api_key=os.getenv("CHROMA_API_KEY"),
    tenant=os.getenv("CHROMA_TENANT"),
    database=os.getenv("CHROMA_DATABASE")
)

collection = client.create_collection(name="requeen_history")

with open("chroma/red_queen_history.txt", "r", encoding="utf-8") as f:
    history = f.read()

collection.add(
    documents=[history],
    metadatas=[{"source": "red_queen_history.txt"}],
    ids=["red_queen_1"]    
)

# print("ChromaDB collection created and document added.")
# print("Collection name:", collection.name)
# print("Number of documents in collection:", len(collection.get()["documents"]))
# print("Document IDs:", collection.get()["ids"])
# print("Document Metadatas:", collection.get()["metadatas"])
# print("Document Contents:", collection.peek())

results = collection.query(
    query_texts=["Tell me about the Red Queen, in two sentences."],
    n_results=10
)
print("Query Results:", results)