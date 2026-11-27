#!/bin/sh
# Pulls the full texts behind docs/voice/corpus/ from the Internet Archive into
# docs/voice/corpus/full/ (ignored by git). Public domain except where the README says.
set -e
cd "$(dirname "$0")/../docs/voice/corpus"; mkdir -p full
get(){ # archive.org identifier, filename
  curl -fsSL --max-time 180 "https://archive.org/stream/$1/$1_djvu.txt" \
    | python3 -c "import sys,re,html; s=sys.stdin.read(); m=re.search(r'<pre>(.*?)</pre>',s,re.S); sys.stdout.write(html.unescape(m.group(1)) if m else '')" > "full/$2.txt" \
    && printf '%-34s %s bytes\n' "$2" "$(wc -c < "full/$2.txt")" || echo "FAILED $1"
}
get diaryofcountrypa0002wood   woodforde-vol2-1782-87
get diaryofcountrypa0003wood   woodforde-vol3-1788-93
get bub_gb_fCaVWkVDljQC        mavor-berkshire-1809
get b28773135_0002             eden-state-of-the-poor-vol2
get ruralrides01cobb           cobbett-rural-rides-vol1
get lettersofjaneaus01aust     austen-letters-vol1
get expeditionofhump01smol     smollett-humphry-clinker
get castlerackrent00edge       edgeworth-castle-rackrent
get worksofjamesgill00wrig     wright-works-of-gillray
