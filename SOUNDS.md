# Sounds

Every recording in `sound/` comes from [Freesound](https://freesound.org) and every one was released by its maker under
[Creative Commons 0](https://creativecommons.org/publicdomain/zero/1.0/), the public-domain dedication. No credit is owed. It is given here anyway.

Licences were read off each sound's own page on 27 November 2026. All are real recordings but the quill, which its uploader made with a machine and which the owner preferred to a hissy real one.

| File | Heard when | Recording | By | Cut |
|---|---|---|---|---|
| `seal.mp3` | A paper is sealed: taking possession, closing the books | [Wax seal](https://freesound.org/people/Cerise_Virtuelle/sounds/759526/) | Cerise_Virtuelle | whole |
| `page1.mp3` | A leaf turned: new quarter, tabs, handbills | [Book Turn Page 1.wav](https://freesound.org/people/esperri/sounds/119126/) | esperri | whole |
| `page2.mp3` | The same | [Book Turn Page 2.wav](https://freesound.org/people/esperri/sounds/119127/) | esperri | whole |
| `page3.mp3` | The same | [Book Turn Page 3.wav](https://freesound.org/people/esperri/sounds/119128/) | esperri | whole |
| `quill.mp3` | A choice written down | [Ink Quill Writing on Parchment ASMR](https://freesound.org/people/brktkrgll/sounds/856167/) | brktkrgll | first 4.4 s. Machine-generated (ElevenLabs), by the uploader's account |
| `coins.mp3` | A choice that moves money | [change on table.mp3](https://freesound.org/people/rightpurdy/sounds/243517/) | rightpurdy | whole |
| `bell.mp3` | Quarter day | [Church Clock Strikes 2.wav](https://freesound.org/people/JarredGibb/sounds/219051/) | JarredGibb | whole, tail faded |
| `toll.mp3` | A death; a ruin | [St Peters Church, Kinver - Distant Tolling Bell](https://freesound.org/people/TicAshfield/sounds/824588/) | TicAshfield | first 9 s |
| `rook.mp3` | Spare: a single rook | [Rook (Corvus frugilegus)](https://freesound.org/people/Walking.With.Microphones/sounds/556221/) | Walking.With.Microphones | first 3.9 s |
| `rooks.mp3` | Air of spring and summer, and the title page | [Nesting Rooks](https://freesound.org/people/mike_stranks/sounds/434847/) | mike_stranks | 2 to 22 s |
| `rain.mp3` | Air of a ruined harvest | [rain against window](https://freesound.org/people/bastipictures/sounds/243774/) | bastipictures | 1 to 19 s |
| `wind.mp3` | Air of autumn | [Howling wind through window in tower](https://freesound.org/people/tomhannen/sounds/486599/) | tomhannen | 1 to 21 s |
| `fire.mp3` | Air of winter | [Fireplace wood crackling](https://freesound.org/people/Sadiquecat/sounds/707262/) | Sadiquecat | 5 to 25 s |
| `carriage.mp3` | Callers who come on wheels; a journey to town | [old horse drawn carriage drives past](https://freesound.org/people/Garuda1982/sounds/631829/) | Garuda1982 | 7 to 19 s |
| `crowd.mp3` | Elections and victories | [small crowd cheering](https://freesound.org/people/HowardV/sounds/264377/) | HowardV | 9.5 to 16 s |
| `mob.mp3` | Riot, Ludd, the press gang | [S30-32 Unhappy mob talking.wav](https://freesound.org/people/craigsmith/sounds/675085/) | craigsmith | 1 to 13 s |
| `shot.mp3` | The duel; the battue | [S20-32 Flintlock fire.wav](https://freesound.org/people/craigsmith/sounds/675617/) | craigsmith | whole |
| `knocker.mp3` | Somebody at the door | [doorknocker.wav](https://freesound.org/people/mlestn1/sounds/83240/) | mlestn1 | whole |
| `knock.mp3` | Spare: knuckles on a door | [Knocking_Wooden_Door.wav](https://freesound.org/people/Islabonita/sounds/541492/) | Islabonita | whole |

## How they were made

Taken from Freesound's high-quality mp3 previews, cut as above, mixed to mono and encoded as mp3 (the short ones levelled to a peak of -3 dB, the four airs to -24 LUFS). The whole folder is about 1.1 MB. Nothing is loaded until it is first wanted.

## How they are played

`src/sound.js`, stitched in last by `build.sh`. It wraps `render`, `start`, `resume`, `choose`, `undertake`, `showTab` and `showWho` and changes nothing inside them.

- `Sound.play(name, volume, delay)` plays a file once. `Sound.air(name)` sets the long recording under everything, lapped over itself.
- Which paper makes which noise is the `ARRIVES` table. An event not named there knocks; a handbill turns a leaf.
- Master volume is `VOL` (0.6). The airs sit at `AIR` (0.45) of that.
- Turning sound on strikes the church clock once, so the reader knows it has taken.
- If somebody hears nothing, rest the pointer on the control: its tooltip gives the audio state, how many files loaded and the last error.
- The game starts silent. "Sound off" in the corner of the desk turns it on, and the choice is remembered in `localStorage` under `hatherley-quiet`.

## Adding one

Search Freesound with the licence filter set to Creative Commons 0, cut it short, save it mono in `sound/`, add a row above.
