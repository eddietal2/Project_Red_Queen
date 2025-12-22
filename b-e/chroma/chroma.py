import chromadb
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize CloudClient
client = chromadb.CloudClient(
    api_key=os.getenv("CHROMA_API_KEY"),
    tenant=os.getenv("CHROMA_TENANT"),
    database=os.getenv("CHROMA_DATABASE")
)

collection_name = "requeen_history"

# Check if collection exists, if not create it
try:
    collection = client.get_collection(name=collection_name)
    print(f"Collection '{collection_name}' already exists. Using existing collection.")
except ValueError:
    collection = client.create_collection(name=collection_name)
    print(f"Collection '{collection_name}' created successfully.")

# Load the document
with open("chroma/red_queen_history.txt", "r", encoding="utf-8") as f:
    history = f.read()

# Add document to collection
collection.add(
    documents=[history],
    metadatas=[{"source": "red_queen_history.txt"}],
    ids=["red_queen_1"]
)
print("Document added to collection successfully.")

# Retrieve and print collection data including embeddings
collection_data = collection.get(include=["embeddings", "metadatas", "documents"])
print("\nCollection Data:")
print(f"IDs: {collection_data['ids']}")
print(f"Metadatas: {collection_data['metadatas']}")
print(f"Documents: {collection_data['documents'][:200]}...")  # Truncate for readability
print(f"Embeddings (raw vector data): {collection_data['embeddings']}")

# Query the collection
results = collection.query(
    query_texts=["Tell me about the Red Queen, in two sentences."],
    n_results=10
)
print("\nQuery Results:", results)