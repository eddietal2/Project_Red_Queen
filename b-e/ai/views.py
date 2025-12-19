from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .utils import llm, load_system_prompt

# Create your views here.

def hello(request):
    system_prompt = load_system_prompt()
    if system_prompt:
        message = "Hello from Red Queen AI! System prompt loaded."
    else:
        message = "Hello from Red Queen AI!"
    return JsonResponse({'message': message, 'llm_model': getattr(llm, 'model', 'gemini-2.5-flash')})

@csrf_exempt
@require_http_methods(["POST"])
def chat(request):
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
        
        answer = llm.complete(full_prompt)
        return JsonResponse({'answer': str(answer)})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
