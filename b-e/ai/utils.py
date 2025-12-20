"""
Initializes Llama Index's Google AI integration for Django.
"""

import os
import sys
from datetime import datetime
from django.conf import settings
from llama_index.llms.google_genai import GoogleGenAI

def handle_google_ai_error(e):
    error_str = str(e)
    
    if "API key not valid" in error_str:
        return f"❌ Invalid API Key\nCheck your GOOGLE_API_KEY environment variable"
    elif "quota exceeded" in error_str.lower():
        return f"❌ Quota Exceeded\nYou've hit your API usage limit"
    elif "permission denied" in error_str.lower():
        return f"❌ Permission Denied\nAPI key lacks required permissions"
    else:
        return f"❌ Google AI Error:\n{e}"

# Check for API key first
if not settings.GOOGLE_API_KEY:
    print(f"❌ No API Key Found")
    print(f"Please set your GOOGLE_API_KEY environment variable")
    sys.exit(1)

# For Dev & Production, to switch between models more easily
modelTypes = [
    "gemini-3-flash-preview", 
    "gemini-2.5-flash", 
    "gemini-1.5-flash"
]
chosenModelType = modelTypes[1]  # Default = modelTypes[0]

# Initialize Google API Key & Model with error handling
try:
    llm = GoogleGenAI(
        # https://ai.google.dev/gemini-api/docs/models
        model=chosenModelType,
        api_key=settings.GOOGLE_API_KEY,
    )
    print(f"✅ Google AI initialized successfully ({chosenModelType})")
except Exception as e:
    print(handle_google_ai_error(e))
    sys.exit(1)

def load_system_prompt():
    """Load the system prompt from file"""
    try:
        with open(settings.SYSTEM_PROMPT_PATH, "r", encoding="utf-8") as f:
            prompt = f.read()
        # Replace date placeholder
        current_date = datetime.now().strftime('%Y-%m-%d')
        prompt = prompt.replace('{current_date}', current_date)
        return prompt
    except FileNotFoundError:
        print(f"⚠️  System prompt file not found. Using default behavior.")
        return None