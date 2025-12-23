"""
Resident Evil Game Content Wiki Scraper

This script scrapes pages from the Resident Evil Fandom wiki, stores them locally,
and uploads changed content to a ChromaDB vector database for knowledge base purposes.
It includes versioning to track changes and prompt users for selective uploads.

Features:
- Fetch and save game content-related wiki pages as .txt files
- Detect changes using content comparison and diff display
- Prompt user for confirmation before uploading to ChromaDB
- Chunk large documents to fit within ChromaDB's size limits
- Reset functionality to clear versioning and local files

Usage:
- python scraper.py game-content-urls  : Scan game content pages for URLs
"""
# Main Content URLs:
# "game_content": [
#         "https://residentevil.fandom.com/wiki/Template:Game_content_navigation",
#         "https://residentevil.fandom.com/wiki/Template:Files_by_game",
#         "https://residentevil.fandom.com/wiki/Template:Items_by_game",
#         "https://residentevil.fandom.com/wiki/Template:Scene_navigation",
#         "https://residentevil.fandom.com/wiki/Template:Awards_navigation",
#         "https://residentevil.fandom.com/wiki/Template:Game_modes",
#         "https://residentevil.fandom.com/wiki/Template:Loading_screens",
#         "https://residentevil.fandom.com/wiki/Template:Roleplaying",
#         "https://residentevil.fandom.com/wiki/Template:Player_status",
#         "https://residentevil.fandom.com/wiki/Template:Gaming_environment",
#         "https://residentevil.fandom.com/wiki/Template:Background_mechanics"
#     ],

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
    GAME_CONTENT_URLS = data['game_content']
    ALL_URLS = data['all_urls']
    FILES = data['files']

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

def check_page_urls():
    """Scan game content pages for URLs to include in scraping."""
    print(f"{COLOR_YELLOW}Checking game content pages for URLs...{RESET_COLOR}")
    
    # Use game content URLs
    urls_to_check = GAME_CONTENT_URLS
    
    found_urls = set()
    found_files = set()
    
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
                if link.startswith('File:'):
                    # Add to files as full URL using Special:FilePath
                    file_name = link.replace('File:', '').replace(' ', '_')
                    full_file_url = f"{WIKI_URL}/wiki/Special:FilePath/{file_name}"
                    found_files.add(full_file_url)
                elif 'uk:' in link or 'Template:' in link or 'Wikipedia:' in link:
                    continue
                else:
                    # Convert to full URL
                    if not link.startswith('http'):
                        full_url = f"{WIKI_URL}/wiki/{link.replace(' ', '_')}"
                        found_urls.add(full_url)
            
            # print(f"{COLOR_YELLOW}Processed{COLOR_WHITE} {url}{RESET_COLOR}")
            
        except Exception as e:
            print(f"{COLOR_RED}Error fetching {raw_url}: {e}{RESET_COLOR}")
    
    return found_urls, found_files

def main():
    """
    Main entry point. Handles command-line arguments for different operations.
    """
    command = ''
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

    if command == 'game-content-urls':
        found_urls, found_files = check_page_urls()
        
        # Add new URLs to ALL_URLS
        original_all_count = len(ALL_URLS)
        ALL_URLS.extend(url for url in found_urls if url not in ALL_URLS)
        new_all_count = len(ALL_URLS)
        
        # Add new files to FILES
        original_files_count = len(FILES)
        FILES.extend(file for file in found_files if file not in FILES)
        new_files_count = len(FILES)
        
        if new_all_count > original_all_count or new_files_count > original_files_count:
            # Save updated URLs and files to JSON
            data['all_urls'] = sorted(ALL_URLS)
            data['files'] = sorted(FILES)
            with open(URLS_FILE, 'w') as f:
                json.dump(data, f, indent=4)
            added_all = new_all_count - original_all_count
            added_files = new_files_count - original_files_count
            print(f"{COLOR_GREEN}Added {added_all} new URLs to all_urls and {added_files} new files to files.{RESET_COLOR}")
        else:
            print(f"{COLOR_BLUE}No new URLs or files found.{RESET_COLOR}")
        
        # Print found URLs
        if found_urls:
            print(f"{COLOR_GREEN}Found additional URLs:{RESET_COLOR}")
            for url in sorted(found_urls):
                print(url)
        else:
            print(f"{COLOR_YELLOW}No additional URLs found.{RESET_COLOR}")
        
        # Print found files
        if found_files:
            print(f"{COLOR_GREEN}Found additional files:{RESET_COLOR}")
            for file in sorted(found_files):
                print(file)
        else:
            print(f"{COLOR_YELLOW}No additional files found.{RESET_COLOR}")
        
        print(f"{COLOR_GREEN}Total URLs found: {len(found_urls)}, Total files found: {len(found_files)}{RESET_COLOR}")
    else:
        print(f"{COLOR_RED}Unknown command: {command}{RESET_COLOR}")
        print("Available commands: fetch, game-content-urls")
if __name__ == "__main__":
    main()
