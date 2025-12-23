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

def getLorePages():
    ACTION_RAW = "?action=raw"
    lore_urls = [
        "https://residentevil.fandom.com/wiki/Template:Lore_navigation",
        "https://residentevil.fandom.com/wiki/Template:Characters_navigation",
        "https://residentevil.fandom.com/wiki/Template:Biological_Agents",
        "https://residentevil.fandom.com/wiki/Template:Biohazard",
        "https://residentevil.fandom.com/wiki/Template:Events",
        "https://residentevil.fandom.com/wiki/Template:Organisations",
        "https://residentevil.fandom.com/wiki/Template:Bio-weapons_industry",
        "https://residentevil.fandom.com/wiki/Template:Timeline",
        "https://residentevil.fandom.com/wiki/Template:Equipment",
        "https://residentevil.fandom.com/wiki/Template:Locations_navigation"
    ]

    print(f"{COLOR_YELLOW}Fetching Lore Pages...{RESET_COLOR}")

getLorePages()
