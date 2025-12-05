import { Orientation } from "@lib/orientation"
import { FilePlus, FileMinus } from "react-bootstrap-icons"

export default function IncDec(
  { orientation, onInc, onDec, title }: {
    orientation: Orientation
    onInc: () => void
    onDec: () => void
    title?: string
  }
) {
  return (
    <div
      className={[
        'flex justify-evenly h-full',
        `flex-${orientation === Orientation.Horizontal ? 'row' : 'col'}`
      ].join(' ')}
      title={title} >
      {/* sub */}
      <button 
        className={[
          'cursor-pointer text-center'
        ].join(' ')}
        onClick={onDec} >
        <FileMinus 
          className={[
            'm-auto',
            orientation == Orientation.Horizontal ? '' : `rotate-90`
          ].join(' ')} />
      </button>
      {/* add */}
      <button 
        className={[
          'cursor-pointer text-center'
        ].join(' ')}
        onClick={onInc} >
        <FilePlus 
          className={[
            'm-auto',
            orientation == Orientation.Horizontal ? '' : `rotate-90`
          ].join(' ')} />
      </button>
    </div>
  )
}