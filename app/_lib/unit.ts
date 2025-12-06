/**
 * Convert dynamic viewport height to pixels. Requires `window.innerHeight`.
 */
export function dvhToPx(dvh: number) {
  return (dvh / 100) * window.innerHeight
}

export function pxToDvh(px: number) {
  return (px / window.innerHeight) * 100
}

const getFontSizeToPx = () => (
  Number(
    window.getComputedStyle(document.body)
    .getPropertyValue('font-size')
    .match(/\d+/)![0]
  )
)

/**
 * Convert pixels to font size (~`em`). Requires `document.body.style`.
 */
export function pxToFontSize(px: number) {
  return px / getFontSizeToPx()
}

export function fontSizeToPx(em: number) {
  return em * getFontSizeToPx()
}