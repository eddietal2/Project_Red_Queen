"""
Initializes Llama Index's Google AI integration for Django.
"""

import os
import sys
from datetime import datetime
from dotenv import load_dotenv
from django.conf import settings

# Load environment variables (in case settings.py hasn't loaded them yet)
load_dotenv()
from llama_index.llms.google_genai import GoogleGenAI

class MockLLM:
    """Mock LLM for testing that doesn't use API calls"""
    
    def __init__(self, model="mock-gemini-2.5-flash"):
        self.model = model
    
    def complete(self, prompt):
        """Return a mock response based on the prompt"""
        # Simple mock responses based on prompt content
        prompt_lower = prompt.lower()
        
        if "hello" in prompt_lower or "hi" in prompt_lower:
            return "Hello! I'm Red Queen AI in test mode. How can I help you today?"
        
        elif "weather" in prompt_lower:
            return "In test mode, I can't check the actual weather, but I'd say it's a beautiful day for coding! ☀️"
        
        elif "time" in prompt_lower or "date" in prompt_lower:
            current_time = datetime.now().strftime('%I:%M %p')
            current_date = datetime.now().strftime('%A, %B %d, %Y')
            return f"It's currently {current_time} on {current_date}. (Test mode response)"
        
        elif "joke" in prompt_lower:
            return "Why did the developer go broke? Because he used up all his cache! 💸 (Test mode joke)"
        
        elif "code" in prompt_lower or "python" in prompt_lower:
            return "Here's a simple Python test function:\n\n```python\ndef test_function():\n    return 'Hello from test mode!'\n```\n\nThis is a mock response - no API calls were made."
        
        else:
            return f"This is a test response from Red Queen AI. You asked: '{prompt[:100]}{'...' if len(prompt) > 100 else ''}'\n\nI'm currently in test mode, so I'm not using your Gemini API quota. To switch to live mode, set TEST_MODE=false in your environment variables."

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

# Check for API key first (only needed in live mode)
try:
    test_mode = settings.TEST_MODE
    has_api_key = bool(settings.GOOGLE_API_KEY)
except:
    # Settings not configured yet (e.g., when importing directly)
    test_mode = os.environ.get("TEST_MODE", "false").lower() == "true"
    has_api_key = bool(os.environ.get("GOOGLE_API_KEY"))

if not test_mode and not has_api_key:
    print(f"❌ No API Key Found")
    print(f"Please set your GOOGLE_API_KEY environment variable")
    sys.exit(1)

# For Dev & Production, to switch between models more easily
modelTypes = [
    "gemini-3-flash-preview", 
    "gemini-2.5-flash", 
    "gemini-2.0-flash-lite"
]
chosenModelType = modelTypes[1]  # Default = modelTypes[0]

# Initialize LLM based on test mode
if test_mode:
    llm = MockLLM(model=f"mock-{chosenModelType}")
    print(f"✅ Mock AI initialized successfully ({chosenModelType} - TEST MODE)")
else:
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