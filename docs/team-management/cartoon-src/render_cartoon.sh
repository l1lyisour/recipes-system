#!/bin/bash
# Render the cartoon in 4 parallel chunks, then mux with the narration track.
set -e
C="$1"; N=4
export NODE_PATH=$(npm root -g)
TOTAL=$(node -e "const fs=require('fs');eval(fs.readFileSync('$C/data.js','utf8').replace('const DATA','global.DATA'));console.log(Math.ceil(DATA.total*DATA.fps))")
STEP=$(( (TOTAL + N - 1) / N ))
mkdir -p "$C/chunks"
for i in $(seq 0 $((N-1))); do
  node "$(dirname "$0")/cartoon_frames.js" "$C/anim.html" video "$C/chunks/c$i.mp4" $((i*STEP)) $(( (i+1)*STEP < TOTAL ? (i+1)*STEP : TOTAL )) &
done
wait
for i in $(seq 0 $((N-1))); do echo "file '$C/chunks/c$i.mp4'"; done > "$C/chunks/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$C/chunks/list.txt" -i "$C/audio/full.wav" -map 0:v -map 1:a -c:v copy -c:a aac -b:a 160k -ar 48000 -shortest -movflags +faststart "$C/multfilm.mp4"
echo "frames $TOTAL done"
