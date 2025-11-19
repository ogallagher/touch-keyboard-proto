import { Orientation } from "@lib/orientation"
import { FilePlus, FileMinus } from "react-bootstrap-icons"

export default function IncDec(
  { orientation, onInc, onDec }: {
    orientation: Orientation
    onInc: () => void
    onDec: () => void
  }
) {
  return (
    <div
      className={[
        'flex justify-evenly',
        `flex-${orientation === Orientation.Horizontal ? 'row' : 'col'}`,
        (orientation === Orientation.Horizontal ? '' : 'flex-col-reverse')
      ].join(' ')}>
      {/* add */}
      <button 
        className={orientation == Orientation.Horizontal ? '' : `rotate-90`}
        onClick={onDec} >
        <FileMinus />
      </button>
      {/* sub */}
      <button 
        className={orientation == Orientation.Horizontal ? '' : `rotate-90`}
        onClick={onInc} >
        <FilePlus />
      </button>
    </div>
  )
}