#!/usr/bin/env python3
"""
Test script for TTS Module
"""

import asyncio
from ai.tts_module import TTSModule

async def main():
    tts = TTSModule()
    text = "Hello, I am a British child voice."
    audio_path = await tts.generate_speech(text)
    print(f"Generated audio: {audio_path}")

if __name__ == "__main__":
    asyncio.run(main())

