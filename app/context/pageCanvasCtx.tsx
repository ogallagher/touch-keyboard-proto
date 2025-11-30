import { createContext, RefObject } from "react"

export type ShowCanvasListener = () => void

export class PageCanvasState {
  public readonly canvas: RefObject<HTMLCanvasElement|null> = { current: null as HTMLCanvasElement|null }
  public setCanvas(canvas: HTMLCanvasElement) {
    this.canvas.current = canvas
  }

  private _showGesturesCanvas = true
  get showGesturesCanvas() {
    return this._showGesturesCanvas
  }
  setShowGesturesCanvas(val: boolean) {
    this._showGesturesCanvas = val
    Array.from(this.showGesturesListeners.values()).forEach(l => l())
  }
  public readonly showGesturesListeners: Map<string, ShowCanvasListener> = new Map()
}

export const PageCanvasCtx = createContext(null as unknown as PageCanvasState)
