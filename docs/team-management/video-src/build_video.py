"""Build the narrated slide video: TTS per segment, slide still + audio per clip, concat, SRT."""
import asyncio, json, os, re, subprocess, sys, textwrap
import certifi
certifi.where = lambda: "/root/.ccr/ca-bundle.crt"
import edge_tts

VIDEO_DIR = sys.argv[1]
sys.path.insert(0, VIDEO_DIR)
from narration import SEGMENTS, VOICES

TOOLS = os.path.dirname(os.path.abspath(__file__))
BUILD = os.path.join(VIDEO_DIR, "build")
os.makedirs(BUILD, exist_ok=True)
GAP = 0.7  # silence after each segment, seconds


def run(*cmd):
    subprocess.run(cmd, check=True)


def duration(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())


async def tts(text, voice, pitch, mp3):
    cues = []
    com = edge_tts.Communicate(text.replace("\n", " "), voice, pitch=pitch, boundary="SentenceBoundary")
    with open(mp3, "wb") as f:
        async for chunk in com.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "SentenceBoundary":
                cues.append((chunk["offset"] / 1e7, (chunk["offset"] + chunk["duration"]) / 1e7, chunk["text"]))
    return cues


def split_cue(start, end, text, width=84):
    # Long sentences become several two-line cues, timed by character share.
    parts = textwrap.wrap(text, width * 2 - 4)
    total = sum(len(p) for p in parts)
    out, t = [], start
    for p in parts:
        d = (end - start) * len(p) / total
        out.append((t, t + d, "\n".join(textwrap.wrap(p, width))))
        t += d
    return out


def ts(t):
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}"


async def main():
    specs = sorted({s for s, _, _ in SEGMENTS})
    run("node", os.path.join(TOOLS, "render.js"), os.path.join(VIDEO_DIR, "slides.html"), BUILD, *specs)

    clips, srt, t0 = [], [], 0.0
    for i, (spec, spk, text) in enumerate(SEGMENTS):
        voice, pitch = VOICES[spk]
        mp3 = os.path.join(BUILD, f"{i:02}.mp3")
        for attempt in range(4):
            try:
                cues = await tts(text, voice, pitch, mp3)
                break
            except Exception as e:  # transient network errors
                print("retry", i, e, file=sys.stderr)
                await asyncio.sleep(2 ** attempt)
        else:
            raise SystemExit(f"TTS failed for segment {i}")
        d = duration(mp3)
        png = os.path.join(BUILD, spec.replace(":", "_") + ".png")
        clip = os.path.join(BUILD, f"{i:02}.mp4")
        run("ffmpeg", "-v", "error", "-y", "-loop", "1", "-framerate", "25", "-i", png, "-i", mp3,
            "-af", f"apad=pad_dur={GAP}", "-t", f"{d + GAP:.3f}",
            "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p", "-r", "25",
            "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-ac", "2", clip)
        clips.append(clip)
        real = duration(clip)
        for s, e, txt in cues:
            for cs, ce, ctext in split_cue(s, e, txt):
                srt.append((t0 + cs, t0 + min(ce, d), f"{ctext}"))
        print(f"{i:02} {spec:10} {spk} {real:6.1f}s", flush=True)
        t0 += real

    lst = os.path.join(BUILD, "list.txt")
    with open(lst, "w") as f:
        f.writelines(f"file '{c}'\n" for c in clips)
    srt_path = os.path.join(VIDEO_DIR, "videorazbor.srt")
    with open(srt_path, "w", encoding="utf-8") as f:
        for n, (s, e, txt) in enumerate(srt, 1):
            f.write(f"{n}\n{ts(s)} --> {ts(e)}\n{txt}\n\n")
    out = os.path.join(VIDEO_DIR, "videorazbor.mp4")
    run("ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-i", srt_path,
        "-map", "0", "-map", "1", "-c", "copy", "-c:s", "mov_text",
        "-metadata:s:s:0", "language=rus", "-movflags", "+faststart", out)
    print("total", round(t0 / 60, 2), "min ->", out)

asyncio.run(main())
