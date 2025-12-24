import asyncio
import edge_tts

async def list_voices():
    voices = await edge_tts.list_voices()
    gb_voices = [v for v in voices if v['Locale'] == 'en-GB']
    print('British English voices:')
    for v in gb_voices:
        print(f"{v['ShortName']}: {v['FriendlyName']}")

asyncio.run(list_voices())