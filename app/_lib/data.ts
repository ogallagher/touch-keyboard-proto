import pako from "pako"

/**
 * Use characters outside of [base64 charset](https://en.wikipedia.org/wiki/Base64#Alphabet) that ideally are not escaped in uri components,
 * to minimize string length.
 * 
 * I also included replacement of /, +, = to strings that are shorter in uri components.
 */
const serverAntiInjectSafeEscape = new Map([
  ['a', '.'],
  ['e', '.e'],
  ['i', '.i'],
  ['o', '.o'],
  ['u', '.u'],
  ['A', '.A'],
  ['E', '.E'],
  ['I', '.I'],
  ['O', '.O'],
  ['U', '.U'],
  ['x', '.x'],
  ['X', '.X'],
  ['/', '_'],   // follows base64-url
  ['+', '-'],   // follows base64-url
  ['=', '-e'],
])
const serverAntiInjectSafeUnescape = new Map(
  Array.from(serverAntiInjectSafeEscape.entries())
  .map(([key, val]) => [val, key])
)
const serverAntiInjectSafeEscapeChar0 = new Set(
  Array.from(serverAntiInjectSafeEscape.values())
  .map(escVal => escVal[0])
)

export function compressString(s: string) {
  const b64 = (
    Buffer.from(pako.deflate(Buffer.from(s, 'utf-8')))
    .toString('base64')
  )

  const antisafe = new Array(b64.length)
  let i=0
  for (const c of b64) {
    antisafe[i] = serverAntiInjectSafeEscape.get(c) || c
    i++
  }

  return antisafe.join('')
}

export function decompressString(s: string) {
  const antisafe = s
  const b64 = new Array(s.length)

  let c='', _c = ''
  for (let i=0; i<antisafe.length;) {
    c = antisafe[i]
    if (serverAntiInjectSafeEscapeChar0.has(c)) {
      _c = serverAntiInjectSafeUnescape.get(`${c}${antisafe[i+1]}`) || serverAntiInjectSafeUnescape.get(c) || c
    }
    else {
      _c = c
    }

    b64[i] = _c
    i += serverAntiInjectSafeEscape.get(_c)?.length || 1
  }

  return (
    Buffer.from(pako.inflate(Buffer.from(b64.filter(v => v).join(''), 'base64')))
    .toString('utf-8')
  )
}