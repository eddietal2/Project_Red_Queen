import os
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, Settings
from google_llm_init import llm, log_api_usage
import custom_console
from datetime import datetime

# Set up Gemini as the LLM
Settings.llm = llm

# Load system prompt
def load_system_prompt():
    """Load the system prompt from file"""
    system_prompt_path = "system_prompt.txt"
    try:
        with open(system_prompt_path, "r", encoding="utf-8") as f:
            prompt = f.read()
        # Replace date placeholder
        current_date = datetime.now().strftime('%Y-%m-%d')
        prompt = prompt.replace('{current_date}', current_date)
        return prompt
    except FileNotFoundError:
        print(f"{custom_console.COLOR_YELLOW}⚠️  System prompt file not found. Using default behavior.{custom_console.RESET_COLOR}")
        return None

def chat_with_gemini():
    """Interactive chat function with Gemini"""
    custom_console.clear_console()

    # Load system prompt
    system_prompt = load_system_prompt()
    if system_prompt:
        print(f"{custom_console.COLOR_CYAN}🤖 Red Queen AI Assistant initialized!{custom_console.RESET_COLOR}")
    else:
        print(f"{custom_console.COLOR_CYAN}🤖 Welcome to Gemini Chat!{custom_console.RESET_COLOR}")

    print(f"{custom_console.COLOR_YELLOW}Type 'quit' or 'exit' to end the conversation.{custom_console.RESET_COLOR}")
    print(f"{custom_console.COLOR_YELLOW}Type 'clear' to clear the console.{custom_console.RESET_COLOR}")
    print(f"{custom_console.COLOR_YELLOW}Type 'system' to view the system prompt.{custom_console.RESET_COLOR}")
    print("-" * 50)

    while True:
        try:
            # Get user input
            user_input = input(f"{custom_console.COLOR_GREEN}You: {custom_console.RESET_COLOR}").strip()

            # Handle special commands
            if user_input.lower() in ['quit', 'exit', 'q']:
                print(f"{custom_console.COLOR_CYAN}👋 Goodbye!{custom_console.RESET_COLOR}")
                break
            elif user_input.lower() == 'clear':
                custom_console.clear_console()
                if system_prompt:
                    print(f"{custom_console.COLOR_CYAN}🤖 Red Queen AI Assistant initialized!{custom_console.RESET_COLOR}")
                else:
                    print(f"{custom_console.COLOR_CYAN}🤖 Welcome to Gemini Chat!{custom_console.RESET_COLOR}")
                print(f"{custom_console.COLOR_YELLOW}Type 'quit' or 'exit' to end the conversation.{custom_console.RESET_COLOR}")
                print(f"{custom_console.COLOR_YELLOW}Type 'clear' to clear the console.{custom_console.RESET_COLOR}")
                print(f"{custom_console.COLOR_YELLOW}Type 'system' to view the system prompt.{custom_console.RESET_COLOR}")
                print("-" * 50)
                continue
            elif user_input.lower() == 'system':
                if system_prompt:
                    print(f"{custom_console.COLOR_BLUE}System Prompt:{custom_console.RESET_COLOR}")
                    print(system_prompt)
                    print("-" * 50)
                else:
                    print(f"{custom_console.COLOR_YELLOW}No system prompt loaded.{custom_console.RESET_COLOR}")
                continue
            elif not user_input:
                continue

            # Generate response from Gemini
            print(f"{custom_console.COLOR_BLUE}Red Queen: {custom_console.RESET_COLOR}", end="", flush=True)
            log_api_usage()
            response = llm.complete(user_input)
            print(response)

        except KeyboardInterrupt:
            print(f"\n{custom_console.COLOR_CYAN}👋 Goodbye!{custom_console.RESET_COLOR}")
            break
        except Exception as e:
            print(f"{custom_console.COLOR_RED}❌ Error: {str(e)}{custom_console.RESET_COLOR}")

# Example with LlamaIndex (commented out for now)
# if os.path.exists('data'):
#     documents = SimpleDirectoryReader('data').load_data()
#     index = VectorStoreIndex.from_documents(documents)
#     query_engine = index.as_query_engine()
#
#     # Generate response
#     response = query_engine.query("Hello, Red Queen!")
#     print(response)
# else:
#     print("Data directory not found. Please create a 'data' folder with documents.")

def main():
    chat_with_gemini()

if __name__ == "__main__":
    main()
