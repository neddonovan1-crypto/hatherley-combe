#!/bin/sh
# Pulls the reference corpus from Project Gutenberg into docs/voice/corpus/.
# Plain text, public domain. Prints each title so a wrong number is obvious.
set -e
cd "$(dirname "$0")/../docs/voice/corpus"
get(){ # id filename
  f="$2.txt"
  curl -fsSL --max-time 120 -o "$f.part" "https://www.gutenberg.org/cache/epub/$1/pg$1.txt" || { echo "FAILED $1 $2"; rm -f "$f.part"; return 0; }
  mv "$f.part" "$f"; printf '%-28s %s\n' "$2" "$(grep -m1 '^Title:' "$f" | tr -d '\r')"
}
get 158   austen-emma
get 105   austen-persuasion
get 1342  austen-pride-and-prejudice
get 42078 austen-letters
get 34238 cobbett-rural-rides
get 1424  edgeworth-castle-rackrent
get 6053  burney-evelina
get 6593  fielding-tom-jones
get 2160  smollett-humphry-clinker
get 1079  sterne-tristram-shandy
get 1408  white-selborne
get 2496  mitford-our-village
get 5402  grose-vulgar-tongue-1811
