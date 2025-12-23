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

def getSmallerTopics():
    ACTION_RAW = "?action=raw"
    smaller_topics_urls = [
        "https://residentevil.fandom.com/wiki/Template:Staff_navigation",
        "https://residentevil.fandom.com/wiki/Template:Real_companies",
        "https://residentevil.fandom.com/wiki/Continuities",
        "https://residentevil.fandom.com/wiki/Template:Interviews",
        "https://residentevil.fandom.com/wiki/Template:Trade_show_navigation",
        "https://residentevil.fandom.com/wiki/Template:Magazine",
        "https://residentevil.fandom.com/wiki/Template:Real_life_years",
        "https://residentevil.fandom.com/wiki/Template:Analyses",
        "https://residentevil.fandom.com/wiki/Template:Other_topics"
    ]

    print(f"{COLOR_YELLOW}Fetching Smaller Topics Pages...{RESET_COLOR}")

getSmallerTopics()
