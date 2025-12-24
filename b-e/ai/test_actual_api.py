#!/usr/bin/env python3
"""
Test the actual /chat API endpoint (not using Django test client)
"""

import requests
import json
import os
import time

def test_actual_chat_api():
    """Test the actual running API endpoint"""
    url = "http://localhost:8000/ai/chat/"

    data = {
        'question': 'Hello, can you tell me a short joke?'
    }

    try:
        print("Testing actual /chat API endpoint...")
        print(f"URL: {url}")
        print(f"Data: {data}")

        response = requests.post(url, json=data, timeout=30)

        print(f"\nResponse Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'Not specified')}")
        print(f"Content-Disposition: {response.headers.get('Content-Disposition', 'Not specified')}")
        print(f"Content-Length: {len(response.content)} bytes")

        if response.status_code == 200:
            if 'audio/mpeg' in response.headers.get('Content-Type', ''):
                print("✅ SUCCESS: MP3 file returned from actual API!")

                # Save the file for verification
                timestamp = int(time.time())
                filename = f"api_response_{timestamp}.mp3"
                filepath = os.path.join(os.path.dirname(__file__), 'generated_audio', filename)

                os.makedirs(os.path.dirname(filepath), exist_ok=True)
                with open(filepath, 'wb') as f:
                    f.write(response.content)

                print(f"✅ Saved actual API response to: {filepath}")
                print(f"✅ File size: {len(response.content)} bytes")

                return True
            else:
                print("❌ FAILED: Expected audio/mpeg content type")
                print(f"Response preview: {response.text[:200]}...")
                return False
        else:
            print(f"❌ FAILED: HTTP {response.status_code}")
            print(f"Response: {response.text}")
            return False

    except requests.exceptions.ConnectionError:
        print("❌ FAILED: Could not connect to server. Is Django running on localhost:8000?")
        print("💡 Start the server with: python manage.py runserver")
        return False
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")
        return False

if __name__ == "__main__":
    test_actual_chat_api()