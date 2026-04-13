"""
Simple British Child Female Voice TTS Module
Note: TTS functionality has been removed for lightweight Vercel deployment.
Use external TTS services or restore edge-tts package if needed.
"""

class TTSModule:
    """Stub TTS Module - TTS disabled for Vercel deployment"""
    
    def __init__(self):
        self.voice = "en-GB-MaisieNeural"  # British child female voice (reference only)
        self.enabled = False

    async def generate_speech_with_timings(self, text: str) -> dict:
        """TTS disabled - returns empty response"""
        return {
            "audio_path": None,
            "word_timings": []
        }

    async def generate_speech(self, text: str) -> str:
        """TTS disabled - returns None"""
        return None
    
    def generate_speech_sync(self, text: str) -> str:
        """Synchronous stub - TTS disabled"""
        return None
