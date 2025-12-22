import chromadb
import os
import hashlib
import difflib
from datetime import datetime
from dotenv import load_dotenv
from custom_console import COLOR_MAGENTA, COLOR_YELLOW, COLOR_GREEN, COLOR_CYAN, COLOR_RED, RESET_COLOR

load_dotenv()

def get_file_hash(filepath):
    """Compute SHA256 hash of the file content."""
    hash_sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()

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
    print(f"{COLOR_YELLOW}Collection '{collection_name}' already exists. Using existing collection.{RESET_COLOR}")
except ValueError:
    collection = client.create_collection(name=collection_name)
    print(f"{COLOR_GREEN}Collection '{collection_name}' created successfully.{RESET_COLOR}")

# File to track changes
file_path = "chroma/red_queen_history.txt"
content_file = "chroma/last_content.txt"
update_file = "chroma/last_update.txt"

# Load the document and compute hash
with open(file_path, "r", encoding="utf-8") as f:
    history = f.read()
current_hash = get_file_hash(file_path)

# Check if content has changed
if os.path.exists(content_file):
    with open(content_file, "r", encoding="utf-8") as f:
        old_content = f.read()
else:
    old_content = ""

if old_content != history:
    # Compute diff
    diff = list(difflib.unified_diff(old_content.splitlines(keepends=True), history.splitlines(keepends=True), fromfile='old', tofile='new', lineterm=''))
    print(f"{COLOR_RED}Changes were made to document!{RESET_COLOR}")
    for line in diff:
        if line.startswith('+'):
            print(f"{COLOR_GREEN}{line.rstrip()}{RESET_COLOR}")
        elif line.startswith('-'):
            print(f"{COLOR_RED}{line.rstrip()}{RESET_COLOR}")
        else:
            print(line.rstrip())
    print(f"{COLOR_GREEN}Document updated in collection successfully.{RESET_COLOR}")
    # Update the collection
    collection.upsert(
        documents=[history],
        metadatas=[{"source": "red_queen_history.txt"}],
        ids=["red_queen_1"]
    )
    # Retrieve and print collection data including embeddings
    collection_data = collection.get(include=["embeddings", "metadatas", "documents"])
    print(f"{COLOR_CYAN}\nCollection Data:{RESET_COLOR}")
    print(f"IDs: {collection_data['ids']}")
    print(f"Metadatas: {collection_data['metadatas']}")
    print(f"Documents: {collection_data['documents'][:200]}...")  # Truncate for readability
    print(f"{COLOR_MAGENTA}Embeddings (raw vector data): {collection_data['embeddings']}{RESET_COLOR}")
    
    # Save the new content
    with open(content_file, "w", encoding="utf-8") as f:
        f.write(history)
    # Save the update date
    with open(update_file, "w") as f:
        f.write(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
else:
    if os.path.exists(update_file):
        with open(update_file, "r") as f:
            last_update = f.read().strip()
        print(f"{COLOR_CYAN}No changes detected in red_queen_history.txt. Collection is up-to-date. Last updated: {last_update}{RESET_COLOR}")
    else:
        print(f"{COLOR_CYAN}No changes detected in red_queen_history.txt. Collection is up-to-date.{RESET_COLOR}")

# Query the collection
results = collection.query(
    query_texts=["Tell me about the Red Queen, in two sentences."],
    n_results=10
)
