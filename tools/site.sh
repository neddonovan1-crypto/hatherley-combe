#!/bin/sh
# Lays out a folder a plain web host can serve: the page with a doctype and charset, and the pictures (and sounds, if any) beside it.
set -e
cd "$(dirname "$0")/.."
out="${1:?usage: tools/site.sh <empty folder>}"
mkdir -p "$out"
{ printf '<!doctype html>\n<html lang="en-GB">\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'; cat index.html; } > "$out/index.html"
cp -r art "$out/"
[ ! -d sound ] || cp -r sound "$out/"
echo "site laid out in $out"
