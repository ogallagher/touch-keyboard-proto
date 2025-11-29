import pako from "pako"

export function compressString(s: string) {
  return pako.deflate(Buffer.from(s, 'utf-8')).toBase64()
}

export function decompressString(s: string) {
  return (
    Buffer.from(pako.inflate(Buffer.from(s, 'base64')))
    .toString('utf-8')
  )
}