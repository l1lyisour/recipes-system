"""TTS per segment with sentence cues, mouth envelope, full audio track, data.js for the cartoon."""
import asyncio, json, os, subprocess, sys
import numpy as np
import certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

OUT = sys.argv[1]
sys.path.insert(0, sys.argv[2])
from narration import SEGMENTS, VOICES
FPS, GAP, SR = 24, 0.8, 48000
os.makedirs(os.path.join(OUT, "audio"), exist_ok=True)


async def tts(text, voice, pitch, mp3):
    cues = []
    com = edge_tts.Communicate(text.replace("\n", " "), voice, pitch=pitch, boundary="SentenceBoundary")
    with open(mp3, "wb") as f:
        async for ch in com.stream():
            if ch["type"] == "audio":
                f.write(ch["data"])
            elif ch["type"] == "SentenceBoundary":
                cues.append({"start": ch["offset"] / 1e7, "end": (ch["offset"] + ch["duration"]) / 1e7, "text": ch["text"]})
    return cues


def pcm(path):
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)


async def main():
    segs, tracks, start = [], [], 0.0
    for i, (spec, spk, text) in enumerate(SEGMENTS):
        mp3 = os.path.join(OUT, "audio", f"{i:02}.mp3")
        voice, pitch = VOICES[spk]
        for attempt in range(5):
            try:
                cues = await tts(text, voice, pitch, mp3)
                break
            except Exception as e:
                print("retry", i, e, file=sys.stderr)
                await asyncio.sleep(2 ** attempt)
        else:
            raise SystemExit(f"TTS failed for {i}")
        a = np.concatenate([pcm(mp3), np.zeros(int(GAP * SR), np.float32)])
        dur = len(a) / SR
        hop = SR // FPS
        n = int(np.ceil(len(a) / hop))
        rms = np.array([np.sqrt(np.mean(a[k * hop:(k + 1) * hop] ** 2)) if k * hop < len(a) else 0 for k in range(n)])
        ref = np.percentile(rms[rms > 1e-4], 90) if np.any(rms > 1e-4) else 1
        env = np.clip(rms / ref, 0, 1)
        env = np.convolve(env, [0.25, 0.5, 0.25], mode="same")
        env[env < 0.08] = 0
        segs.append({"spec": spec, "speaker": spk, "start": round(start, 4), "dur": round(dur, 4),
                     "cues": cues, "env": [int(v * 100) for v in env]})
        tracks.append(a)
        print(f"{i:02} {spec:10} {spk} {dur:6.1f}s cues={len(cues)}", flush=True)
        start += dur
    full = np.concatenate(tracks)
    wav = os.path.join(OUT, "audio", "full.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_s16le", wav],
                   input=full.tobytes(), check=True)
    with open(os.path.join(OUT, "data.js"), "w", encoding="utf-8") as f:
        f.write("const DATA = " + json.dumps({"fps": FPS, "total": round(start, 4), "segments": segs}, ensure_ascii=False) + ";\n")
    print("total", round(start / 60, 2), "min")

asyncio.run(main())
