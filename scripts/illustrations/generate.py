# Generates course illustrations with a free Hugging Face Space (runs in GitHub Actions).
# Skips images that already exist, so edit a prompt and delete its file to redo it.
import json, os, shutil, sys
from gradio_client import Client
from PIL import Image

cfg = json.load(open("assets-pipeline/illustrations.json"))
out = "public/images/illustrations"
os.makedirs(out, exist_ok=True)
tok = os.environ.get("HF_TOKEN") or None
try:
    client = Client(cfg["space"], token=tok)
except TypeError:
    client = Client(cfg["space"], hf_token=tok)
try:
    print(json.dumps(client.view_api(return_format="dict", print_info=False), default=str)[:3000])
except Exception as e:
    print("view_api failed", e)
failed = 0
for it in cfg["items"]:
    dest = f"{out}/{it['name']}.jpg"
    if os.path.exists(dest):
        print("skip", dest); continue
    prompt = f"{it['prompt']} {cfg['style']}"
    try:
        res = client.predict(prompt=prompt, seed=it.get("seed", 7), randomize_seed=False,
                             aspect_ratio="16:9", guidance_scale=1, num_inference_steps=8,
                             api_name="/generate_image")
        path = res[0] if isinstance(res, (list, tuple)) else res
        if isinstance(path, dict): path = path.get("path") or path.get("url")
        im = Image.open(path).convert("RGB")
        im.thumbnail((1600, 900))
        im.save(dest, quality=84, optimize=True, progressive=True)
        print("ok", dest, im.size)
    except Exception as e:
        failed += 1
        print("FAIL", it["name"], repr(e)[:500])
sys.exit(1 if failed == len(cfg["items"]) else 0)
