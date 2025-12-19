from django.shortcuts import render
from django.http import JsonResponse
from .utils import llm, load_system_prompt

# Create your views here.

def hello(request):
    system_prompt = load_system_prompt()
    if system_prompt:
        message = "Hello from Red Queen AI! System prompt loaded."
    else:
        message = "Hello from Red Queen AI!"
    return JsonResponse({'message': message, 'llm_model': getattr(llm, 'model', 'gemini-2.5-flash')})
