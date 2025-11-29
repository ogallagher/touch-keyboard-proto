import pako from "pako"

export function compressString(s: string) {
  return (
    Buffer.from(pako.deflate(Buffer.from(s, 'utf-8')))
    .toString('base64')
  )
}

export function decompressString(s: string) {
  return (
    Buffer.from(pako.inflate(Buffer.from(s, 'base64')))
    .toString('utf-8')
  )
}