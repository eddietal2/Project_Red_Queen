"""
Batch Fetch and Store Script for Resident Evil Wiki URLs

This script processes all URLs from the urls.json file, fetches their raw content,
and stores them in ChromaDB for RAG purposes.

Features:
- Fetches raw wiki content from all URLs in all_urls array
- Stores content in ChromaDB with metadata
- Handles errors gracefully
- Provides progress tracking

Usage:
- python batch_fetch.py
"""

import os
import sys
import json
import urllib.request
import time
import chromadb
from datetime import datetime
from dotenv import load_dotenv

# Add path to custom modules
sys.path.append('../../')
from custom_console import (
    COLOR_MAGENTA, COLOR_WHITE, COLOR_YELLOW, COLOR_BLUE,
    COLOR_RED, COLOR_GREEN, COLOR_CYAN, RESET_COLOR
)

# Load URLs from JSON
URLS_FILE = os.path.join(os.path.dirname(__file__), 'urls', 'urls.json')
with open(URLS_FILE, 'r') as f:
    data = json.load(f)
    ALL_URLS = data['all_urls']

# Load environment variables
load_dotenv()

# Configuration constants
WIKI_URL = "https://residentevil.fandom.com"

def fetch_raw_content(url):
    """Fetch raw content from a wiki URL."""
    raw_url = url + "?action=raw"
    try:
        with urllib.request.urlopen(raw_url) as response:
            content = response.read().decode('utf-8')
        return content
    except Exception as e:
        print(f"{COLOR_RED}Error fetching {raw_url}: {e}{RESET_COLOR}")
        return None

def chunk_text(text, chunk_size=4000):
    """Split text into chunks of specified size."""
    chunks = []
    for i in range(0, len(text), chunk_size):
        chunks.append(text[i:i + chunk_size])
    return chunks

def store_in_chromadb(url, content, collection):
    """Store content in ChromaDB with metadata, chunking large documents."""
    if not content:
        return

    # Create a unique base ID from the URL
    base_doc_id = url.replace(WIKI_URL + '/wiki/', '').replace('/', '_')

    # Extract title from URL for metadata
    title = url.split('/')[-1].replace('_', ' ')

    # Check if content needs chunking (rough estimate: 4000 chars ≈ 8KB)
    if len(content) > 4000:
        chunks = chunk_text(content, chunk_size=4000)
        print(f"{COLOR_YELLOW}Chunking document into {len(chunks)} parts{RESET_COLOR}")
        
        for i, chunk in enumerate(chunks):
            doc_id = f"{base_doc_id}_chunk_{i}"
            collection.add(
                documents=[chunk],
                metadatas=[{
                    'url': url,
                    'title': title,
                    'source': 'resident_evil_wiki',
                    'chunk': i,
                    'total_chunks': len(chunks)
                }],
                ids=[doc_id]
            )
    else:
        # Single document
        collection.add(
            documents=[content],
            metadatas=[{
                'url': url,
                'title': title,
                'source': 'resident_evil_wiki'
            }],
            ids=[base_doc_id]
        )

def main():
    """Main batch processing function."""
    start_time = time.time()
    print(f"{COLOR_YELLOW}Starting batch fetch for {len(ALL_URLS)} URLs...{RESET_COLOR}")

    # Initialize ChromaDB Cloud client with same settings as chroma.py
    client = chromadb.CloudClient(
        api_key=os.getenv("CHROMA_API_KEY"),
        tenant=os.getenv("CHROMA_TENANT"),
        database=os.getenv("CHROMA_DATABASE")
    )

    # Use one collection for all Resident Evil content
    collection_name = "resident_evil_knowledge"
    
    # Reset collection by deleting and recreating
    try:
        client.delete_collection(name=collection_name)
        print(f"{COLOR_YELLOW}Deleted existing collection '{collection_name}'{RESET_COLOR}")
    except Exception as e:
        print(f"{COLOR_BLUE}Collection '{collection_name}' did not exist or could not be deleted: {e}{RESET_COLOR}")
    
    collection = client.create_collection(name=collection_name)
    print(f"{COLOR_GREEN}Created fresh collection '{collection_name}'{RESET_COLOR}")

    processed = 0
    errors = 0
    error_log = []  # Track all errors

    for i, url in enumerate(ALL_URLS, 1):
        elapsed = time.time() - start_time
        print(f"{COLOR_WHITE}Processing {i}/{len(ALL_URLS)}: {url} ({COLOR_MAGENTA}Elapsed: {elapsed:.1f}s){RESET_COLOR}")

        # Fetch content
        content = fetch_raw_content(url)

        if content:
            # Store in ChromaDB
            store_in_chromadb(url, content, collection)
            processed += 1
            print(f"{COLOR_GREEN}✓ Stored content for {url.split('/')[-1]}{RESET_COLOR}")
        else:
            errors += 1
            error_msg = f"Failed to fetch: {url}"
            error_log.append(error_msg)
            print(f"{COLOR_RED}✗ {error_msg}{RESET_COLOR}")

        # Small delay to be respectful to the server
        time.sleep(0.1)

    total_time = time.time() - start_time
    print(f"\n{COLOR_GREEN}Batch processing complete!{RESET_COLOR}")
    print(f"{COLOR_WHITE}Processed: {processed}{RESET_COLOR}")
    print(f"{COLOR_RED}Errors: {errors}{RESET_COLOR}")
    print(f"{COLOR_BLUE}Total documents in collection: {collection.count()}{RESET_COLOR}")
    print(f"{COLOR_CYAN}Total time: {total_time:.1f} seconds{RESET_COLOR}")

    # Write error log if there were errors
    if error_log:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_filename = f"batch_update_{timestamp}.txt"
        
        with open(log_filename, 'w') as f:
            f.write(f"Batch Fetch Error Log - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
            f.write("=" * 60 + "\n\n")
            f.write(f"Total URLs processed: {len(ALL_URLS)}\n")
            f.write(f"Successfully processed: {processed}\n")
            f.write(f"Errors encountered: {errors}\n")
            f.write(f"Total time: {total_time:.1f} seconds\n\n")
            f.write("Error Details:\n")
            f.write("-" * 30 + "\n")
            for error in error_log:
                f.write(f"{error}\n")
        
        print(f"{COLOR_YELLOW}Error log saved to: {log_filename}{RESET_COLOR}")

if __name__ == "__main__":
    main()