# touch-keyboard-proto

Web app to configure and test prototype touchscreen keyboards with variable gestures and layouts.

# Justification

When typing in languages with non latin script characters on touch screen devices, there is a growing number of options that break away from the classic keyboard of touch/button keys that is a direct virtual representation of a physical keyboard with layouts like QWERTY.

Extensions that modify or replace the OS touch screen keyboard must be written in a language native to that platform. Higher abstractions like React native don’t have that level of access. \
However, making a multi platform prototype as a web (or local app) is worthwhile, since the advantage of being accessible for testing to more people can outweigh its limited scope to be strictly within that app. \
This multi platform and isolated prototype is customizable for easy testing of different layouts. \
Then, in theory, functional touch keyboard designs can be implemented as native OS keyboard apps separately.

# Default keyboards

## `eng-frthen`

> **TODO** frthen preview

Among vowels, E is most common, so it’s center of vowels key with other English vowels at the 4 cardinal swipes. The vowels key is also at the center of the 9 letter keys, arranged in a 3x3 grid.

Consonants grouped by similarity of sound and relative frequency[^1]. Relative frequency in  `<`angle brackets`>`. X and C are arguable, so I have them in both, and underlined. I grouped R,W,Y because they are pseudo vowels.

[^1]: I don't currently know from where I derived the character or bigram relative frequencies.

| SOFT | HARD | 
| --- | --- |
| `m` <.02> | `b` `p` <.03> |
| `l` <.04> | `d` `t` `j` <.05> |
| `n` <.07> | `g` `k` `q` `x` `c` <.01> |
| `s` `z` `x` `c` <.02> |  |
| `f` `v` <.02> |  |
| `h` <.06> |  |
| `r` `w` `y` <.03> | |

Where there was extra space (ex. below t, th) I added a couple bigrams (letter pairs). Top 10 by relative frequency[^1]:

- th = .039
- he = .037
- in = .023
- er = .022
- an = .021
- re = .018
- nd = .016
- ha = .012
- to = .012
- hi = .011
- ng = .011
- sh = ?   

Whitespace and punctuation adds a bottom row; all numbers and other symbols would be in a separate view.

Touch and hold or swipe and hold could provide more options, like diacritics (áüçêñ) and doubles (o→oo), (e→ee). Doubles shortcut may not be worth it.

In addition to hold, a return swipe (ex from center to right, then return to center) can be a separate gesture, as used in [딩굴](https://namu.wiki/w/%EB%94%A9%EA%B5%B4%20%ED%82%A4%EB%B3%B4%EB%93%9C). Similar idea to swipe hold. For punctuation maybe ('→"), (-→=), (.→…), (,→;), (?→¿), (!→¡). For vowel pairs (e→ie).

Also, a long/ over return swipe, which goes beyond center on return. (a→ai), (o→ou).

An turn/ corner swipe could be used, similar to diagonal, but yielding 2 options for each corner. Q down = qu, g c up = ck, s c up = ch, m up = mb, l up = ld, nd left = nt. For vowel diphthongs also.

## `digits-3x3`

> **TODO** digits preview

# Specification

An abstract key cell recognizes gestures, each mapped to 0, 1, or many key strokes.

## Gestures

All gestures are considered to begin in the center of the key cell.

| name | graphic | description |
| --- | --- | --- |
| `touch` | | |
| `touch hold` | | |
| `swipe hold` | | |
| `cardinal swipe` | | |
| `diagonal swipe` | | |
| `return swipe` | | |
| `corner swipe` | | |
| `diagonal return swipe` | | |
| `diagonal corner swipe` | | |
| `return over swipe` | | |
| `diagonal return over swipe` | | |

## Preview and gesture labels

The labels to show the current gesture type and keystroke output can either be static, or float above the pointer like a context menu during the gesture.

## Choice from multiple options

In cases where a gesture opens multiple options (ex. touch hold for diacritics), a static vertical list context menu opens just above the pointer.

## Edit/configure mode

In edit mode, text inputs and related controls for typing performance evaluation are replaced with config options. 

Site settings/config (ex. floating vs static preview and gesture labels).

Define the keystroke output for the current key gesture.

Key options include which keystroke labels to show at rest within the key cell.

Keyboard grid dimensions, row and column counts.

Name of the keyboard.

## Test/evaluate mode

A free-form, unmonitored text area.

Integrate with an existing typing test service to evaluate one's performance with the current keyboard.

## Save and share

A configured key grid (keyboard) is saved in url query params as a sharable link.