# Records translated video narration with Kokoro (Apache-2.0). Runs in GitHub Actions.
#   python scripts/narration/generate_i18n.py lines.json
# Skips lines already recorded; writes src/content/videos/audio-manifest.<lang>.json.
import json, os, subprocess, sys, time
import numpy as np
import soundfile as sf
from kokoro import KPipeline

cfg = json.load(open(sys.argv[1]))
lang, voice, lines = cfg["lang"], cfg["voice"], cfg["lines"]
out = "public/audio"
os.makedirs(out, exist_ok=True)
todo = [l for l in lines if not os.path.exists(f"{out}/{l['id']}.mp3")]
print(f"{lang} voice {voice}: {len(lines)} lines, {len(todo)} to record", flush=True)
if todo:
    pipe = KPipeline(lang_code=cfg["kokoroLang"], repo_id="hexgrad/Kokoro-82M")
    for n, l in enumerate(todo, 1):
        t0 = time.time()
        try:
            parts = [a.numpy() if hasattr(a, "numpy") else a for _, _, a in pipe(l["text"], voice=voice, speed=0.95)]
            audio = np.concatenate(parts)
            wav = f"{out}/{l['id']}.wav"
            sf.write(wav, audio, 24000)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1", "-b:a", "64k", f"{out}/{l['id']}.mp3"], check=True)
            os.remove(wav)
            print(f"{n}/{len(todo)} {l['id']} {time.time()-t0:.1f}s {l['text'][:50]}", flush=True)
        except Exception as e:
            print(f"FAIL {l['id']} {e!r} :: {l['text'][:80]}", flush=True)
have = [l["id"] for l in lines if os.path.exists(f"{out}/{l['id']}.mp3")]
json.dump({"voice": voice, "ids": have}, open(f"src/content/videos/audio-manifest.{lang}.json", "w"))
print(f"manifest: {len(have)}/{len(lines)} lines have audio")
