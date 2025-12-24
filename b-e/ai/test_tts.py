#!/usr/bin/env python3
"""
Test script for TTS Module and Django Integration
"""

import asyncio
import os
import sys
import django
from pathlib import Path

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from .tts_module import TTSModule

async def test_tts_direct():
    """Test TTS module directly"""
    print("Testing TTS module directly...")
    tts = TTSModule()
    text = "Hello, I am a British child voice."
    audio_path = await tts.generate_speech(text)
    print(f"✓ Generated audio: {audio_path}")
    
    # Check file exists and has content
    if os.path.exists(audio_path):
        size = os.path.getsize(audio_path)
        print(f"✓ File size: {size} bytes")
    else:
        print("✗ File not created")

def test_django_view():
    """Test Django view integration"""
    print("\nTesting Django view integration...")
    from django.test import Client
    from django.http import JsonResponse
    
    client = Client()
    
    # Test the chat endpoint
    data = {'question': 'Hello, who are you?'}
    response = client.post('/ai/chat/', data=data, content_type='application/json')
    
    print(f"✓ Response status: {response.status_code}")
    print(f"✓ Content type: {response.get('Content-Type', 'Unknown')}")
    
    if response.status_code == 200:
        if 'audio/mpeg' in response.get('Content-Type', ''):
            print("✓ MP3 response received!")
            # Save the MP3 for testing in the generated_audio directory
            test_file_path = os.path.join(os.path.dirname(__file__), 'generated_audio', 'test_response.mp3')
            os.makedirs(os.path.dirname(test_file_path), exist_ok=True)
            with open(test_file_path, 'wb') as f:
                f.write(response.content)
            print(f"✓ Saved {test_file_path}")
        else:
            print("✗ Expected audio/mpeg content type")
            print(f"Response: {response.content[:200]}...")
    else:
        print(f"✗ Error response: {response.content}")

if __name__ == "__main__":
    # Test TTS directly
    asyncio.run(test_tts_direct())
    
    # Test Django integration
    test_django_view()

