#!/bin/sh
# Lays out a folder a plain web host can serve: the page with a doctype and charset, the pictures pressed for the web beside it (tools/press.py),
# the sounds if any, and word to the host (Netlify reads _headers) that a pressed picture may be kept by a browser for good.
set -e
cd "$(dirname "$0")/.."
out="${1:?usage: tools/site.sh <empty folder>}"
mkdir -p "$out"
{ printf '<!doctype html>\n<html lang="en-GB">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'; cat index.html; } > "$out/index.html"
python3 tools/press.py "$out"
[ ! -d sound ] || cp -r sound "$out/"
# A pressed picture's name changes whenever the picture does, so it never need be asked for twice. A sound keeps its name, and is kept a week.
cat > "$out/_headers" <<'H'
/p/*
  Cache-Control: public, max-age=31536000, immutable
/sound/*
  Cache-Control: public, max-age=604800
H
echo "site laid out in $out"
