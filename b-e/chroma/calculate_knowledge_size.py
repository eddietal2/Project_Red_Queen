#!/usr/bin/env python3
"""
Script to calculate the cumulative size of the 'resident_evil_knowledge' ChromaDB collection.
This script connects to the ChromaDB cloud instance and calculates the total memory size
of all documents and metadata in the collection.
"""

import os
import sys
from dotenv import load_dotenv
import chromadb
from custom_console import COLOR_MAGENTA, COLOR_YELLOW, COLOR_GREEN, COLOR_CYAN, COLOR_RED, RESET_COLOR

# Load environment variables
load_dotenv()

def format_bytes(bytes_size):
    """Format bytes into human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes_size < 1024.0:
            return f"{bytes_size:.1f} {unit}"
        bytes_size /= 1024.0
    return f"{bytes_size:.1f} TB"

def calculate_collection_size():
    """Calculate the cumulative size of the resident_evil_knowledge collection"""

    print(f"{COLOR_CYAN}🔍 Calculating size of 'resident_evil_knowledge' collection...{RESET_COLOR}")

    try:
        # Initialize ChromaDB Cloud client with same settings as other scripts
        client = chromadb.CloudClient(
            api_key=os.getenv("CHROMA_API_KEY"),
            tenant=os.getenv("CHROMA_TENANT"),
            database=os.getenv("CHROMA_DATABASE")
        )

        collection_name = "resident_evil_knowledge"

        # Check if collection exists
        try:
            collection = client.get_collection(name=collection_name)
            print(f"{COLOR_GREEN}✅ Connected to collection '{collection_name}'{RESET_COLOR}")
        except ValueError as e:
            print(f"{COLOR_RED}❌ Collection '{collection_name}' not found: {e}{RESET_COLOR}")
            return

        # Get collection statistics
        total_docs = collection.count()
        print(f"{COLOR_YELLOW}📊 Collection contains {total_docs} documents{RESET_COLOR}")

        if total_docs == 0:
            print(f"{COLOR_YELLOW}⚠️  Collection is empty{RESET_COLOR}")
            return

        # Retrieve all documents and metadata
        print(f"{COLOR_CYAN}📥 Retrieving all documents and metadata...{RESET_COLOR}")
        print(f"{COLOR_YELLOW}⚠️  Note: Using small batches to respect ChromaDB quota limits{RESET_COLOR}")

        # Get all data in small batches to respect quota limits
        batch_size = 50  # Much smaller batch size for free tier
        total_content_size = 0
        total_metadata_size = 0
        total_documents = 0

        for offset in range(0, total_docs, batch_size):
            limit = min(batch_size, total_docs - offset)

            # Get batch of documents
            results = collection.get(
                limit=limit,
                offset=offset,
                include=['documents', 'metadatas']
            )

            documents = results.get('documents', [])
            metadatas = results.get('metadatas', [])

            # Calculate sizes for this batch
            for doc, metadata in zip(documents, metadatas):
                if doc:
                    # Calculate document content size (UTF-8 bytes)
                    content_size = len(doc.encode('utf-8'))
                    total_content_size += content_size

                if metadata:
                    # Calculate metadata size (JSON serialized)
                    import json
                    metadata_str = json.dumps(metadata, sort_keys=True)
                    metadata_size = len(metadata_str.encode('utf-8'))
                    total_metadata_size += metadata_size

                total_documents += 1

            print(f"{COLOR_CYAN}  Processed {min(offset + limit, total_docs)}/{total_docs} documents...{RESET_COLOR}")

            # Add a small delay between batches to be respectful
            import time
            time.sleep(0.1)

        # Calculate totals
        total_size_bytes = total_content_size + total_metadata_size

        print(f"\n{COLOR_GREEN}📈 SIZE CALCULATION RESULTS:{RESET_COLOR}")
        print(f"{COLOR_YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET_COLOR}")
        print(f"{COLOR_CYAN}Total Documents:{RESET_COLOR} {total_documents}")
        print(f"{COLOR_CYAN}Content Size:{RESET_COLOR} {format_bytes(total_content_size)} ({total_content_size:,} bytes)")
        print(f"{COLOR_CYAN}Metadata Size:{RESET_COLOR} {format_bytes(total_metadata_size)} ({total_metadata_size:,} bytes)")
        print(f"{COLOR_CYAN}Total Size:{RESET_COLOR} {format_bytes(total_size_bytes)} ({total_size_bytes:,} bytes)")
        print(f"{COLOR_YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET_COLOR}")

        # Additional statistics
        avg_content_size = total_content_size / total_documents if total_documents > 0 else 0
        avg_metadata_size = total_metadata_size / total_documents if total_documents > 0 else 0

        print(f"\n{COLOR_MAGENTA}📊 AVERAGE SIZES:{RESET_COLOR}")
        print(f"{COLOR_CYAN}Average Content Size:{RESET_COLOR} {format_bytes(avg_content_size)} ({avg_content_size:.0f} bytes)")
        print(f"{COLOR_CYAN}Average Metadata Size:{RESET_COLOR} {format_bytes(avg_metadata_size)} ({avg_metadata_size:.0f} bytes)")

        return {
            'total_documents': total_documents,
            'content_size_bytes': total_content_size,
            'metadata_size_bytes': total_metadata_size,
            'total_size_bytes': total_size_bytes,
            'content_size_formatted': format_bytes(total_content_size),
            'metadata_size_formatted': format_bytes(total_metadata_size),
            'total_size_formatted': format_bytes(total_size_bytes)
        }

    except Exception as e:
        print(f"{COLOR_RED}❌ Error calculating collection size: {e}{RESET_COLOR}")
        import traceback
        traceback.print_exc()
        return None

def main():
    """Main function"""
    print(f"{COLOR_MAGENTA}🧟 RESIDENT EVIL KNOWLEDGE BASE SIZE CALCULATOR 🧟{RESET_COLOR}")
    print(f"{COLOR_YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━{RESET_COLOR}")

    # Check environment variables
    required_env_vars = ['CHROMA_API_KEY', 'CHROMA_TENANT', 'CHROMA_DATABASE']
    missing_vars = [var for var in required_env_vars if not os.getenv(var)]

    if missing_vars:
        print(f"{COLOR_RED}❌ Missing required environment variables: {', '.join(missing_vars)}{RESET_COLOR}")
        print(f"{COLOR_YELLOW}Please ensure your .env file contains these variables.{RESET_COLOR}")
        sys.exit(1)

    # Calculate and display results
    result = calculate_collection_size()

    if result:
        print(f"\n{COLOR_GREEN}✅ Size calculation completed successfully!{RESET_COLOR}")
        return result
    else:
        print(f"\n{COLOR_RED}❌ Size calculation failed.{RESET_COLOR}")
        sys.exit(1)

if __name__ == "__main__":
    main()