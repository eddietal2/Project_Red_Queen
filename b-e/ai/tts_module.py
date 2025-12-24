"""
Simple British Child Female Voice TTS with Voice Matching
"""

import asyncio
import edge_tts
from pathlib import Path
import librosa
import numpy as np
from pydub import AudioSegment

class TTSModule:
    def __init__(self):
        self.voice = "en-GB-MaisieNeural"  # British child female voice
        self.reference_clip = Path("voice_clip.mp3")

    def analyze_reference_voice(self):
        """Analyze the reference voice clip."""
        if not self.reference_clip.exists():
            return None

        audio, sr = librosa.load(str(self.reference_clip), sr=None)
        pitches, magnitudes = librosa.piptrack(y=audio, sr=sr)
        pitch_values = pitches[pitches > 0]

        if len(pitch_values) > 0:
            avg_pitch = np.mean(pitch_values)
            return {
                'avg_pitch': avg_pitch,
                'sample_rate': sr,
                'duration': len(audio) / sr
            }
        return None

    async def generate_speech(self, text: str) -> str:
        """Generate speech from text and match to reference voice."""
        # Generate base speech
        temp_path = Path("generated_audio") / "temp_speech.mp3"
        output_path = Path("generated_audio") / "speech.mp3"
        output_path.parent.mkdir(exist_ok=True)

        communicate = edge_tts.Communicate(text, self.voice)
        await communicate.save(str(temp_path))

        # Analyze reference voice
        ref_analysis = self.analyze_reference_voice()
        if ref_analysis:
            # Load generated audio for processing
            gen_audio_data, gen_sr = librosa.load(str(temp_path), sr=None)

            # Calculate pitch ratio to match reference
            # Use a more reasonable target pitch (the reference is unusually high)
            target_pitch = min(ref_analysis['avg_pitch'], 300)  # Cap at 300Hz for child voice

            # Estimate generated audio pitch
            gen_pitches, _ = librosa.piptrack(y=gen_audio_data, sr=gen_sr)
            gen_pitch_values = gen_pitches[gen_pitches > 0]
            gen_avg_pitch = np.mean(gen_pitch_values) if len(gen_pitch_values) > 0 else 220

            # Calculate pitch ratio
            pitch_ratio = target_pitch / gen_avg_pitch if gen_avg_pitch > 0 else 1.0

            # Apply gentle pitch shifting
            if 0.5 < pitch_ratio < 2.0:
                n_steps = np.log2(pitch_ratio) * 6  # Gentler shifting
                gen_audio_data = librosa.effects.pitch_shift(gen_audio_data, sr=gen_sr, n_steps=n_steps)

            # Convert back to AudioSegment and save
            import io
            import soundfile as sf

            # Save as WAV temporarily
            wav_buffer = io.BytesIO()
            sf.write(wav_buffer, gen_audio_data, gen_sr, format='wav')
            wav_buffer.seek(0)

            # Convert to MP3
            gen_audio = AudioSegment.from_wav(wav_buffer)
            gen_audio = gen_audio.normalize()
            gen_audio.export(str(output_path), format="mp3")

            # Clean up temp file
            temp_path.unlink(missing_ok=True)
        else:
            # No reference analysis, just move temp file
            temp_path.replace(output_path)

        return str(output_path)
