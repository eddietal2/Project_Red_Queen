from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings
import json
import os
import logging
from datetime import datetime
from pathlib import Path
from .utils import llm, load_system_prompt
from .tts_module import TTSModule

logger = logging.getLogger(__name__)

# Create your views here.

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
    
    # Log to Django logs
    logger.info(f"Gemini API usage: {usage['count']} requests today ({today})")


def hello(request):
    system_prompt = load_system_prompt()
    if system_prompt:
        message = "Hello from Red Queen AI! System prompt loaded."
    else:
        message = "Hello from Red Queen AI!"
    return JsonResponse({'message': message, 'llm_model': getattr(llm, 'model', 'gemini-2.5-flash')})

@csrf_exempt
def chat(request):
    if request.method == 'OPTIONS':
        return JsonResponse({})
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        data = json.loads(request.body)
        question = data.get('question', '')
        if not question:
            return JsonResponse({'error': 'Question is required'}, status=400)
        
        system_prompt = load_system_prompt()
        if system_prompt:
            full_prompt = system_prompt + "\n\n" + question
        else:
            full_prompt = question
        
        # Try up to 3 times with exponential backoff
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Only log API usage in live mode
                if not getattr(settings, 'TEST_MODE', False):
                    log_api_usage()
                answer = llm.complete(full_prompt)
                answer_text = str(answer)
                
                # Generate speech from the answer
                tts = TTSModule()
                
                # Handle async TTS generation in sync context
                import asyncio
                try:
                    # Create a new event loop for this thread
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    audio_path = loop.run_until_complete(tts.generate_speech(answer_text))
                    loop.close()
                    
                    # Return both text and audio
                    with open(audio_path, 'rb') as audio_file:
                        audio_data = audio_file.read()
                    
                    # Get the filename from the generated path
                    filename = Path(audio_path).name
                    
                    # Return JSON response with both text and audio
                    import base64
                    response_data = {
                        'text': answer_text,
                        'audio': base64.b64encode(audio_data).decode('utf-8'),
                        'filename': filename
                    }
                    return JsonResponse(response_data)
                    
                except Exception as tts_error:
                    logger.error(f"TTS generation failed: {tts_error}")
                    # Generate fallback audio for the error
                    try:
                        fallback_text = "I'm sorry, there was an error generating the audio response. Please try again."
                        loop = asyncio.new_event_loop()
                        asyncio.set_event_loop(loop)
                        audio_path = loop.run_until_complete(tts.generate_speech(fallback_text))
                        loop.close()
                        
                        with open(audio_path, 'rb') as audio_file:
                            audio_data = audio_file.read()
                        
                        filename = Path(audio_path).name
                        
                        # Return JSON response with both text and audio
                        import base64
                        response_data = {
                            'text': fallback_text,
                            'audio': base64.b64encode(audio_data).decode('utf-8'),
                            'filename': filename
                        }
                        return JsonResponse(response_data)
                    except Exception as fallback_error:
                        logger.error(f"Fallback TTS also failed: {fallback_error}")
                        # Last resort: return a simple beep or error tone
                        # For now, return JSON as final fallback
                        return JsonResponse({'error': 'Audio generation failed', 'message': str(tts_error)})
                
            except Exception as e:
                error_str = str(e)
                if "429" in error_str or "RESOURCE_EXHAUSTED" in error_str or "quota exceeded" in error_str.lower():
                    # Quota exceeded - return user-friendly message
                    return JsonResponse({
                        'answer': "🤖 Red Queen AI: I've reached my daily conversation limit with my current plan. This is normal for the free tier! Please try again tomorrow when my quota resets, or consider upgrading to a paid plan for unlimited conversations.\n\n💡 Tip: You can continue chatting with existing messages in your session - I remember our conversation history!",
                        'quota_exceeded': True
                    })
                elif attempt == max_retries - 1:  # Last attempt
                    print(f"Chat API Error (final attempt): {str(e)}")
                    print(f"Error type: {type(e)}")
                    import traceback
                    print(f"Traceback: {traceback.format_exc()}")
                    return JsonResponse({'error': f'AI Service temporarily unavailable. Please try again later.'}, status=500)
                else:
                    # Wait before retrying (exponential backoff)
                    import time
                    wait_time = 2 ** attempt  # 1, 2, 4 seconds
                    print(f"Chat API Error (attempt {attempt + 1}): {str(e)}. Retrying in {wait_time}s...")
                    time.sleep(wait_time)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        print(f"Chat API Error: {str(e)}")
        print(f"Error type: {type(e)}")
        import traceback
        print(f"Traceback: {traceback.format_exc()}")
        return JsonResponse({'error': f'AI Error: {str(e)}'}, status=500)
