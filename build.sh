#!/bin/sh
# Stitches src/ into one index.html. Pictures stay beside it in art/ and are listed for the page in ART.
set -e
cd "$(dirname "$0")"
JS="src/data.js src/traits.js src/engine.js src/events1.js src/events2.js src/events3.js src/estate.js src/common.js src/farmworks.js src/events4.js src/events5.js src/castle.js src/endings.js src/ventpapers.js src/honours.js src/king.js src/later.js src/suitors.js src/hazards.js src/planart.js src/sayat.js src/sayroom.js"
ART="const ART = new Set([$( [ ! -d art ] || find art -type f \( -name '*.jpg' -o -name '*.webp' -o -name '*.png' -o -name '*.mp4' \) | sed 's#^art/##' | sort | sed "s/.*/'&'/" | paste -sd, - )]);"
script() { cat $JS; echo "$ART"; cat src/stock.js src/plan.js src/ui.js src/sound.js; }
{
  cat src/head.html
  echo '<style>'; cat src/style.css src/plan.css src/endings.css src/ventpapers.css; echo '</style>'
  cat src/body.html
  echo '<script>'; script; echo '</script>'
} > index.html
echo "built index.html ($(wc -c < index.html) bytes)"
# The parts share one script, so a name declared twice breaks the whole page. Catch it here.
if command -v node >/dev/null 2>&1; then
  script | node -e "new Function(require('fs').readFileSync(0,'utf8'))" || { echo 'build.sh: the combined script does not parse' >&2; exit 1; }
fi
