"""
Resident Evil Franchise Wiki Scraper

This script scrapes pages from the Resident Evil Fandom wiki, stores them locally,
and uploads changed content to a ChromaDB vector database for knowledge base purposes.
It includes versioning to track changes and prompt users for selective uploads.

Features:
- Fetch and save franchise-related wiki pages as .txt files
- Detect changes using content comparison and diff display
- Prompt user for confirmation before uploading to ChromaDB
- Chunk large documents to fit within ChromaDB's size limits
- Reset functionality to clear versioning and local files

Usage:
- python scraper.py              : Run full check and upload process
- python scraper.py fetch        : Fetch pages from wiki
- python scraper.py check        : Check for changes and prompt
- python scraper.py upload       : Upload all .txt files
- python scraper.py reset        : Reset versioning and delete files
- python scraper.py franchise-urls: Scan franchise pages for URLs
"""

import os
import sys
import time
import json
import urllib.request
import difflib
import chromadb
import re
from dotenv import load_dotenv

# Load URLs from JSON
URLS_FILE = os.path.join(os.path.dirname(__file__), '..', 'urls', 'urls.json')
with open(URLS_FILE, 'r') as f:
    data = json.load(f)
    FRANCHISE_URLS = data['franchise']
    ALL_URLS = data['all_urls']

# Add path to custom modules
sys.path.append('../../../')
from custom_console import (
    COLOR_WHITE, COLOR_YELLOW, COLOR_BLUE, 
    COLOR_RED, COLOR_GREEN, RESET_COLOR
)

# Load environment variables
load_dotenv()

# Configuration constants
WIKI_URL = "https://residentevil.fandom.com"
OUTPUT_DIR = "data"

# Versioning file paths
LAST_CONTENT_FILE = "last_franchise_content.json"
LAST_UPDATE_FILE = "last_franchise_update.txt"

# ChromaDB setup
client = chromadb.CloudClient(
    api_key=os.getenv("CHROMA_API_KEY"),
    tenant=os.getenv("CHROMA_TENANT"),
    database=os.getenv("CHROMA_DATABASE")
)
COLLECTION = client.get_or_create_collection(name="franchise-data")

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)


def get_franchise_pages():
    """
    Fetch and save Resident Evil Franchise wiki pages as .txt files.
    
    Uses the wiki's raw action to get plain text content, sanitizes filenames,
    and saves to the output directory.
    """
    action_raw = "?action=raw"
    
    print(f"{COLOR_YELLOW}Fetching Resident Evil Franchise Pages...{RESET_COLOR}")
    
    for url in FRANCHISE_URLS:
        raw_url = url + action_raw
        try:
            with urllib.request.urlopen(raw_url) as response:
                content = response.read().decode('utf-8')
            
            # Extract and sanitize filename from URL
            page_title = url.split('/')[-1].replace(':', '_')
            filename = f"{page_title}.txt"
            filepath = os.path.join(OUTPUT_DIR, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"{COLOR_BLUE}Saved {filename}{RESET_COLOR}")
            
        except Exception as e:
            print(f"{COLOR_RED}Error fetching {raw_url}: {e}{RESET_COLOR}")

def check_page_urls():
    """Scan franchise pages for URLs to include in scraping."""
    print(f"{COLOR_YELLOW}Checking franchise pages for URLs...{RESET_COLOR}")
    
    # Use franchise URLs
    urls_to_check = FRANCHISE_URLS
    
    found_urls = set()
    
    for url in urls_to_check:
        raw_url = url + "?action=raw"
        try:
            with urllib.request.urlopen(raw_url) as response:
                content = response.read().decode('utf-8')
            
            # Find wiki links [[link]]
            links = re.findall(r'\[\[([^\]]+)\]\]', content)
            for link in links:
                # Remove any | for display text
                link = link.split('|')[0]
                # Convert to full URL
                if not link.startswith('http'):
                    full_url = f"{WIKI_URL}/wiki/{link.replace(' ', '_')}"
                    found_urls.add(full_url)
            
            print(f"{COLOR_BLUE}Processed {url}{RESET_COLOR}")
            
        except Exception as e:
            print(f"{COLOR_RED}Error fetching {raw_url}: {e}{RESET_COLOR}")
    
    # Add new URLs to ALL_URLS
    original_count = len(ALL_URLS)
    ALL_URLS.extend(url for url in found_urls if url not in ALL_URLS)
    new_count = len(ALL_URLS)
    
    if new_count > original_count:
        # Save updated URLs to JSON
        data['all_urls'] = sorted(ALL_URLS)
        with open(URLS_FILE, 'w') as f:
            json.dump(data, f, indent=4)
        print(f"{COLOR_GREEN}Added {new_count - original_count} new URLs to the database.{RESET_COLOR}")
    else:
        print(f"{COLOR_BLUE}No new URLs found.{RESET_COLOR}")
    
    # Print found URLs
    if found_urls:
        print(f"{COLOR_GREEN}Found additional URLs:{RESET_COLOR}")
        for url in sorted(found_urls):
            print(url)
    else:
        print(f"{COLOR_YELLOW}No additional URLs found.{RESET_COLOR}")

def check_and_prompt_franchise_uploads():
    """
    Check for changes in local franchise pages and prompt user for uploads.
    
    Compares current content with last saved content, displays diffs for changed files,
    and prompts user to select which files to upload to ChromaDB.
    
    Returns:
        tuple: (files_to_upload, skipped_files) - lists of filenames
    """
    print(f"{COLOR_YELLOW}Checking for changes in Franchise Pages...{RESET_COLOR}")
    
    # Load previously saved content for comparison
    last_content = {}
    if os.path.exists(LAST_CONTENT_FILE):
        with open(LAST_CONTENT_FILE, 'r', encoding='utf-8') as f:
            last_content = json.load(f)
    
    files_to_upload = []
    skipped_files = []
    
    # Check each .txt file in output directory
    for filename in os.listdir(OUTPUT_DIR):
        if not filename.endswith('.txt'):
            continue
            
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            current_content = f.read()
        
        previous_content = last_content.get(filename, "")
        
        if current_content == previous_content:
            print(f"{COLOR_BLUE}No changes for {filename}{RESET_COLOR}")
            continue
        
        # Display changes
        print(f"{COLOR_YELLOW}Changes detected in {filename}:{RESET_COLOR}")
        diff = list(difflib.unified_diff(
            previous_content.splitlines(keepends=True),
            current_content.splitlines(keepends=True),
            fromfile='previous', tofile='current', lineterm=''
        ))
        
        # Show first 20 diff lines for brevity
        for line in diff[:20]:
            if line.startswith('+'):
                print(f"{COLOR_GREEN}{line.rstrip()}{RESET_COLOR}")
            elif line.startswith('-'):
                print(f"{COLOR_RED}{line.rstrip()}{RESET_COLOR}")
            elif line.startswith('@@'):
                print(f"{COLOR_YELLOW}{line.rstrip()}{RESET_COLOR}")
        
        # Prompt user for upload decision
        response = input(f"Upload changes for {filename}? (y/n): ").strip().lower()
        if response == 'y':
            files_to_upload.append(filename)
            print(f"{COLOR_GREEN}Queued {filename} for upload{RESET_COLOR}")
        else:
            skipped_files.append(filename)
            print(f"{COLOR_YELLOW}Skipped {filename}{RESET_COLOR}")
    
    return files_to_upload, skipped_files


def upload_franchise_pages_to_chroma(files_to_upload):
    """
    Upload selected franchise pages to ChromaDB vector database.
    
    Handles document chunking for large files to stay within size limits.
    Updates versioning files with new content and timestamp.
    
    Args:
        files_to_upload (list): List of .txt filenames to upload
    """
    print(f"{COLOR_YELLOW}Uploading selected Franchise Pages to ChromaDB...{RESET_COLOR}")
    
    max_doc_size = 15000  # ChromaDB document size limit buffer
    last_content = {}
    
    # Load existing content for updating
    if os.path.exists(LAST_CONTENT_FILE):
        with open(LAST_CONTENT_FILE, 'r', encoding='utf-8') as f:
            last_content = json.load(f)
    
    updated_any = False
    
    for filename in files_to_upload:
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Reconstruct original wiki URL from filename
        page_title = filename[:-4]  # Remove .txt extension
        url = f"https://residentevil.fandom.com/wiki/{page_title.replace('_', ':')}"
        
        doc_size = len(content.encode('utf-8'))
        
        # Current timestamp for metadata
        current_timestamp = time.strftime('%m/%d/%Y %I:%M %p').lower()
        
        if doc_size <= max_doc_size:
            # Upload as single document
            COLLECTION.add(
                documents=[content],
                metadatas=[{'url': url, 'chunk': 0, 'last_franchise_update': current_timestamp}],
                ids=[filename]
            )
            print(f"{COLOR_BLUE}Added {filename} to ChromaDB{RESET_COLOR}")
        else:
            # Chunk large document
            chunks = []
            chunk_size = max_doc_size // 2
            
            for i in range(0, len(content), chunk_size):
                chunk = content[i:i + chunk_size]
                chunks.append(chunk)
            
            for idx, chunk in enumerate(chunks):
                chunk_id = f"{filename}_chunk_{idx}"
                COLLECTION.add(
                    documents=[chunk],
                    metadatas=[{'url': url, 'chunk': idx, 'last_franchise_update': current_timestamp}],
                    ids=[chunk_id]
                )
                print(f"{COLOR_BLUE}Added {chunk_id} to ChromaDB{RESET_COLOR}")
        
        # Update versioning
        last_content[filename] = content
        updated_any = True
    
    # Save updated versioning information
    if updated_any:
        with open(LAST_CONTENT_FILE, 'w', encoding='utf-8') as f:
            json.dump(last_content, f, ensure_ascii=False, indent=4)
        
        with open(LAST_UPDATE_FILE, 'w') as f:
            f.write(time.strftime("%Y-%m-%d %H:%M:%S"))
        
        print(f"{COLOR_GREEN}Upload complete. Last updated: {time.strftime('%m/%d/%Y %I:%M %p').lower()}{RESET_COLOR}")
    else:
        print(f"{COLOR_BLUE}No uploads performed.{RESET_COLOR}")


def reset_franchise_versioning():
    """
    Reset versioning system by deleting content files and local .txt files.
    
    This clears the change tracking, allowing a fresh start for all pages.
    """
    print(f"{COLOR_YELLOW}Resetting franchise versioning...{RESET_COLOR}")
    
    # Remove versioning files
    print(f"{COLOR_YELLOW}Removing versioning files: {LAST_CONTENT_FILE}, {LAST_UPDATE_FILE}{RESET_COLOR}")
    for file_path in [LAST_CONTENT_FILE, LAST_UPDATE_FILE]:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"{COLOR_YELLOW}Removed {file_path}{RESET_COLOR}")
    
    # Remove all local .txt files
    for filename in os.listdir(OUTPUT_DIR):
        if filename.endswith('.txt'):
            filepath = os.path.join(OUTPUT_DIR, filename)
            os.remove(filepath)
            print(f"{COLOR_YELLOW}Removed {filename}{RESET_COLOR}")
    
    print(f"{COLOR_GREEN}Versioning reset complete.{RESET_COLOR}")


def main():
    """
    Main entry point. Handles command-line arguments for different operations.
    """
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == 'reset':
            reset_franchise_versioning()
        elif command == 'fetch':
            get_franchise_pages()
        elif command == 'check':
            files_to_upload, skipped_files = check_and_prompt_franchise_uploads()
            if files_to_upload:
                upload_franchise_pages_to_chroma(files_to_upload)
            else:
                print(f"{COLOR_BLUE}No files selected for upload.{RESET_COLOR}")
            
            if skipped_files:
                print(f"{COLOR_YELLOW}Skipped uploading to ChromaDB for: {', '.join(skipped_files)}{RESET_COLOR}")
        elif command == 'upload':
            all_files = [f for f in os.listdir(OUTPUT_DIR) if f.endswith('.txt')]
            upload_franchise_pages_to_chroma(all_files)
        elif command == 'franchise-urls':
            check_page_urls()
        else:
            print(f"{COLOR_RED}Unknown command: {command}{RESET_COLOR}")
            print("Available commands: reset, fetch, check, upload, franchise-urls")
    else:
        # Default behavior: check and upload
        files_to_upload, skipped_files = check_and_prompt_franchise_uploads()
        if files_to_upload:
            upload_franchise_pages_to_chroma(files_to_upload)
        else:
            print(f"{COLOR_BLUE}No files selected for upload.{RESET_COLOR}")
        
        if skipped_files:
            print(f"{COLOR_YELLOW}Skipped uploading to ChromaDB for: {', '.join(skipped_files)}{RESET_COLOR}")


if __name__ == "__main__":
    main()