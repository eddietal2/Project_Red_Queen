"""
Simple British Child Female Voice TTS Module
"""

import asyncio
import edge_tts
from pathlib import Path
import time

class TTSModule:
    def __init__(self):
        # Use the British child female voice that best matches the reference
        self.voice = "en-GB-MaisieNeural"  # British child female voice

    async def generate_speech_with_timings(self, text: str) -> dict:
        """Generate speech from text and extract word-level timings."""
        # Use path relative to the ai directory with timestamp
        timestamp = int(time.time() * 1000)  # milliseconds for uniqueness
        output_path = Path(__file__).parent / "generated_audio" / f"speech_{timestamp}.mp3"
        output_path.parent.mkdir(exist_ok=True)

        communicate = edge_tts.Communicate(text, self.voice, boundary="WordBoundary")
        
        word_timings = []
        
        with open(output_path, "wb") as audio_file:
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_file.write(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    start_seconds = chunk["offset"] / 10_000_000  # Convert to seconds
                    end_seconds = (chunk["offset"] + chunk["duration"]) / 10_000_000
                    word = chunk["text"]
                    word_timings.append({
                        "word": word,
                        "start": start_seconds,
                        "end": end_seconds
                    })
        
        return {
            "audio_path": str(output_path),
            "word_timings": word_timings
        }

    async def generate_speech(self, text: str) -> str:
        """Generate speech from text using Edge-TTS."""
        # Use path relative to the ai directory with timestamp
        timestamp = int(time.time() * 1000)  # milliseconds for uniqueness
        output_path = Path(__file__).parent / "generated_audio" / f"speech_{timestamp}.mp3"
        output_path.parent.mkdir(exist_ok=True)

        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(str(output_path))

        return str(output_path)
