import os
import time
import json
import urllib.request
from urllib.parse import quote
import sys
sys.path.append('..')
from custom_console import COLOR_YELLOW, RESET_COLOR

# Configuration
WIKI_URL = "https://residentevil.fandom.com"
API_ENDPOINT = f"{WIKI_URL}/api.php"
OUTPUT_DIR = "red_queen_knowledge"

if not os.path.exists(OUTPUT_DIR):
    os.makedirs(OUTPUT_DIR)

# Pages Groups to source from
# 2 - 4 have collapsed content that needs to be expanded on the webpage.
# 1. Resident Evil Franchise / https://residentevil.fandom.com/wiki/Resident_Evil_franchise
# 2. Lore / https://residentevil.fandom.com/wiki/Template:Lore_navigation
# 3. Game Content / https://residentevil.fandom.com/wiki/Template:Game_content_navigation
# 4. Smaller Topics / https://residentevil.fandom.com/wiki/Template:Content_navigation

def getFrachisePages():
    # ?action=raw
    # https://residentevil.fandom.com/wiki/Resident_Evil_franchise
    # https://residentevil.fandom.com/wiki/Resident_Evil_games
    # https://residentevil.fandom.com/wiki/Resident_Evil_productions
    # https://residentevil.fandom.com/wiki/Resident_Evil_comics
    # https://residentevil.fandom.com/wiki/Resident_Evil_novels
    # https://residentevil.fandom.com/wiki/Supplement_literature
    # https://residentevil.fandom.com/wiki/Template:Guide_books
    # https://residentevil.fandom.com/wiki/Template:Attractions
    # https://residentevil.fandom.com/wiki/Template:Promotions_navigation
    # https://residentevil.fandom.com/wiki/Template:Merchandise
    # https://residentevil.fandom.com/wiki/Template:Cancelled_projects
    # https://residentevil.fandom.com/wiki/Manuals
    # https://residentevil.fandom.com/wiki/Demoware
    # https://residentevil.fandom.com/wiki/Soundtracks_and_albums
    # https://residentevil.fandom.com/wiki/Template:Adverts_navigation
    # https://residentevil.fandom.com/wiki/Anniversaries
    # https://residentevil.fandom.com/wiki/Template:Art_books
    # https://residentevil.fandom.com/wiki/Template:Competitions
    # https://residentevil.fandom.com/wiki/Template:Collaborations
    # https://residentevil.fandom.com/wiki/Template:Non-Resident_Evil

    print(f"{COLOR_YELLOW}Fetching Resident Evil Franchise Pages...{RESET_COLOR}")

def getLorePages():
    # ?action=raw
    # https://residentevil.fandom.com/wiki/Template:Lore_navigation
    # https://residentevil.fandom.com/wiki/Template:Characters_navigation
    # https://residentevil.fandom.com/wiki/Template:Biological_Agents
    # https://residentevil.fandom.com/wiki/Template:Biohazard
    # https://residentevil.fandom.com/wiki/Template:Events
    # https://residentevil.fandom.com/wiki/Template:Organisations
    # https://residentevil.fandom.com/wiki/Template:Bio-weapons_industry
    # https://residentevil.fandom.com/wiki/Template:Timeline
    # https://residentevil.fandom.com/wiki/Template:Equipment
    # https://residentevil.fandom.com/wiki/Template:Locations_navigation

    print(f"{COLOR_YELLOW}Fetching Lore Pages...{RESET_COLOR}")

def getGameContent():
    # ?action=raw
    # https://residentevil.fandom.com/wiki/Template:Game_content_navigation
    # https://residentevil.fandom.com/wiki/Template:Files_by_game
    # https://residentevil.fandom.com/wiki/Template:Items_by_game
    # https://residentevil.fandom.com/wiki/Template:Scene_navigation
    # https://residentevil.fandom.com/wiki/Template:Awards_navigation
    # https://residentevil.fandom.com/wiki/Template:Game_modes
    # https://residentevil.fandom.com/wiki/Template:Loading_screens
    # https://residentevil.fandom.com/wiki/Template:Roleplaying
    # https://residentevil.fandom.com/wiki/Template:Player_status
    # https://residentevil.fandom.com/wiki/Template:Gaming_environment
    # https://residentevil.fandom.com/wiki/Template:Background_mechanics

    print(f"{COLOR_YELLOW}Fetching Game Content Pages...{RESET_COLOR}")

def getSmallerTopics():
    # ?action=raw
    # https://residentevil.fandom.com/wiki/Template:Staff_navigation
    # https://residentevil.fandom.com/wiki/Template:Real_companies
    # https://residentevil.fandom.com/wiki/Continuities
    # https://residentevil.fandom.com/wiki/Template:Interviews
    # https://residentevil.fandom.com/wiki/Template:Trade_show_navigation
    # https://residentevil.fandom.com/wiki/Template:Magazine
    # https://residentevil.fandom.com/wiki/Template:Real_life_years
    # https://residentevil.fandom.com/wiki/Template:Analyses
    # https://residentevil.fandom.com/wiki/Template:Other_topics

    print(f"{COLOR_YELLOW}Fetching Smaller Topics Pages...{RESET_COLOR}")

getFrachisePages()
getLorePages()
getGameContent()
getSmallerTopics()