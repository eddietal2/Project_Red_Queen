"""
Initializes Llama Index's Google AI integration.
"""

import os
import sys
import json
from datetime import datetime
from dotenv import load_dotenv

# Add project root to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import custom_console
from llama_index.llms.google_genai import GoogleGenAI

# Load environment variables from .env file
try:
    load_dotenv()
except UnicodeDecodeError:
    print("Warning: .env file has encoding issues in google_llm_init. Skipping.")

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
TEST_MODE = os.environ.get("TEST_MODE")

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
        return f"{custom_console.COLOR_RED}❌ Invalid API Key\n{custom_console.RESET_COLOR}Check your GOOGLE_API_KEY environment variable"
    elif "quota exceeded" in error_str.lower():
        return f"{custom_console.COLOR_RED}❌ Quota Exceeded\n{custom_console.RESET_COLOR}You've hit your API usage limit"
    elif "permission denied" in error_str.lower():
        return f"{custom_console.COLOR_RED}❌ Permission Denied\n{custom_console.RESET_COLOR}API key lacks required permissions"
    else:
        return f"{custom_console.COLOR_RED}❌ Google AI Error:\n{custom_console.RESET_COLOR}{e}"

def handle_google_ai_error(e):
    error_str = str(e)
    
    if "API key not valid" in error_str:
        return f"{custom_console.COLOR_RED}❌ Invalid API Key\n{custom_console.RESET_COLOR}Check your GOOGLE_API_KEY environment variable"
    elif "quota exceeded" in error_str.lower():
        return f"{custom_console.COLOR_RED}❌ Quota Exceeded\n{custom_console.RESET_COLOR}You've hit your API usage limit"
    elif "permission denied" in error_str.lower():
        return f"{custom_console.COLOR_RED}❌ Permission Denied\n{custom_console.RESET_COLOR}API key lacks required permissions"
    else:
        return f"{custom_console.COLOR_RED}❌ Google AI Error:\n{custom_console.RESET_COLOR}{e}"

# Check for API key first (only needed in live mode)
if not TEST_MODE and not GOOGLE_API_KEY:
    print(f"{custom_console.COLOR_RED}❌ No API Key Found")
    print(f"{custom_console.RESET_COLOR}Please set your GOOGLE_API_KEY environment variable")
    sys.exit(1)

# Initialize LLM based on test mode
if TEST_MODE:
    llm = MockLLM(model="mock-gemini-2.5-flash")
    print(f"{custom_console.COLOR_GREEN}✅ Mock AI initialized successfully (gemini-2.5-flash - TEST MODE){custom_console.RESET_COLOR}\n")
else:
    # Initialize Google API Key & Model with error handling
    try:
        llm = GoogleGenAI(
            # https://ai.google.dev/gemini-api/docs/models
            model="gemini-2.5-flash",
            api_key=GOOGLE_API_KEY,
        )
        print(f"{custom_console.COLOR_GREEN}✅ Google AI initialized successfully (gemini-2.5-flash){custom_console.RESET_COLOR}\n")
    except Exception as e:
        print(handle_google_ai_error(e))
        sys.exit(1)

def log_api_usage():
    """Log daily API usage count"""
    usage_file = os.path.join(os.path.dirname(__file__), 'api_usage.json')
    today = datetime.now().strftime('%Y-%m-%d')
    
    # Read current usage
    if os.path.exists(usage_file):
        try:
            with open(usage_file, 'r') as f:
                usage = json.load(f)
        except (json.JSONDecodeError, IOError):
            usage = {}
    else:
        usage = {}
    
    # Reset if new day
    if usage.get('date') != today:
        usage = {'date': today, 'count': 0}
    
    # Increment count
    usage['count'] += 1
    
    # Write back
    try:
        with open(usage_file, 'w') as f:
            json.dump(usage, f, indent=2)
    except IOError:
        pass  # Silently fail if can't write
    
    # Log to console
    print(f"{custom_console.COLOR_CYAN}📊 Gemini API usage: {usage['count']} requests today ({today}){custom_console.RESET_COLOR}")

def main():
    print(f"{custom_console.COLOR_YELLOW}Connecting to Google AI via Google LLM Init Module{custom_console.RESET_COLOR}")
    print(llm)

if __name__ == "__main__":
    custom_console.clear_console()
    main()
