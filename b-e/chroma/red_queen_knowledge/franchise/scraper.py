import os
import time
import json
import urllib.request
from urllib.parse import quote
import sys
sys.path.append('..')
from custom_console import COLOR_WHITE, COLOR_YELLOW, COLOR_BLUE, RESET_COLOR
from bs4 import BeautifulSoup

# Configuration
WIKI_URL = "https://residentevil.fandom.com"
API_ENDPOINT = f"{WIKI_URL}/api.php"
OUTPUT_DIR = "."

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Pages Groups to source from
# 2 - 4 have collapsed content that needs to be expanded on the webpage.
# 1. Resident Evil Franchise / https://residentevil.fandom.com/wiki/Resident_Evil_franchise
# 2. Lore / https://residentevil.fandom.com/wiki/Template:Lore_navigation
# 3. Game Content / https://residentevil.fandom.com/wiki/Template:Game_content_navigation
# 4. Smaller Topics / https://residentevil.fandom.com/wiki/Template:Content_navigation

def getFrachisePages():
    ACTION_RAW = "?action=raw"
    franchise_urls = [
        "https://residentevil.fandom.com/wiki/Resident_Evil_franchise",
        "https://residentevil.fandom.com/wiki/Resident_Evil_games",
        "https://residentevil.fandom.com/wiki/Resident_Evil_productions",
        "https://residentevil.fandom.com/wiki/Resident_Evil_comics",
        "https://residentevil.fandom.com/wiki/Resident_Evil_novels",
        "https://residentevil.fandom.com/wiki/Supplement_literature",
        "https://residentevil.fandom.com/wiki/Template:Guide_books",
        "https://residentevil.fandom.com/wiki/Template:Attractions",
        "https://residentevil.fandom.com/wiki/Template:Promotions_navigation",
        "https://residentevil.fandom.com/wiki/Template:Merchandise",
        "https://residentevil.fandom.com/wiki/Template:Cancelled_projects",
        "https://residentevil.fandom.com/wiki/Manuals",
        "https://residentevil.fandom.com/wiki/Demoware",
        "https://residentevil.fandom.com/wiki/Soundtracks_and_albums",
        "https://residentevil.fandom.com/wiki/Template:Adverts_navigation",
        "https://residentevil.fandom.com/wiki/Anniversaries",
        "https://residentevil.fandom.com/wiki/Template:Art_books",
        "https://residentevil.fandom.com/wiki/Template:Competitions",
        "https://residentevil.fandom.com/wiki/Template:Collaborations",
        "https://residentevil.fandom.com/wiki/Template:Non-Resident_Evil"
    ]

    print(f"{COLOR_YELLOW}Fetching Resident Evil Franchise Pages...{RESET_COLOR}")
    for url in franchise_urls:
        raw_url = url + ACTION_RAW
        try:
            with urllib.request.urlopen(raw_url) as response:
                content = response.read().decode('utf-8')
            # Extract filename from URL and sanitize
            page_title = url.split('/')[-1].replace(':', '_')
            filename = f"{page_title}.txt"
            filepath = os.path.join(OUTPUT_DIR, filename)
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"{COLOR_BLUE}Saved {filename}{RESET_COLOR}")
        except Exception as e:
            print(f"{COLOR_YELLOW}Error fetching {raw_url}: {e}{RESET_COLOR}")

getFrachisePages()