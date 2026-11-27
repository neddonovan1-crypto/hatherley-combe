#!/bin/sh
# Stitches src/ into one self-contained index.html.
set -e
cd "$(dirname "$0")"
{
  cat src/head.html
  echo '<style>'; cat src/style.css; echo '</style>'
  cat src/body.html
  echo '<script>'; cat src/data.js src/traits.js src/engine.js src/events1.js src/events2.js src/ui.js; echo '</script>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
