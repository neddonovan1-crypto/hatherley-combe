#!/bin/sh
# Lays out a folder a plain web host can serve: the page with a doctype and charset, and the pictures (and sounds, if any) beside it.
set -e
cd "$(dirname "$0")/.."
out="${1:?usage: tools/site.sh <empty folder>}"
mkdir -p "$out"
{ printf '<!doctype html>\n<html lang="en-GB">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'; cat index.html; } > "$out/index.html"
cp -r art "$out/"
# The host refuses an upload much over 50 MB, so the woodcuts go up pressed a little harder than the repo keeps them.
python3 - "$out" <<'PY'
import glob, sys
from PIL import Image
for f in glob.glob(sys.argv[1] + '/art/events/*.jpg') + glob.glob(sys.argv[1] + '/art/undertakings/*.jpg'):
    Image.open(f).save(f, quality=66, optimize=True)
PY
[ ! -d sound ] || cp -r sound "$out/"
echo "site laid out in $out"
