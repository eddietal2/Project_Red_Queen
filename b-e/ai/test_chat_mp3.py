#!/usr/bin/env python3
"""
Test script to verify /chat route returns MP3 files
"""

import os
import sys
import django

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.test import Client

def test_chat_mp3():
    client = Client()

    # Test the chat endpoint
    data = {'question': 'Hello, how are you?'}
    response = client.post('/ai/chat/', data=data, content_type='application/json')

    print(f'Status: {response.status_code}')
    print(f'Content-Type: {response.get("Content-Type")}')
    print(f'Content-Length: {len(response.content)} bytes')

    if response.status_code == 200 and 'audio/mpeg' in response.get('Content-Type', ''):
        print('✅ SUCCESS: MP3 file returned')
        # Save for verification in the ai/generated_audio directory
        file_path = os.path.join(os.path.dirname(__file__), 'generated_audio', 'verify_chat_response.mp3')
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        with open(file_path, 'wb') as f:
            f.write(response.content)
        print(f'✅ Saved {file_path}')
        print(f'✅ File size: {len(response.content)} bytes')
        return True
    else:
        print('❌ FAILED: Expected MP3 response')
        print(f'Response: {response.content[:200]}...')
        return False

if __name__ == "__main__":
    test_chat_mp3()