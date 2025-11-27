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
        `flex-${orientation === Orientation.Horizontal ? 'row' : 'col'}`
      ].join(' ')}
      title={orientation === Orientation.Horizontal ? 'Adjust column count' : 'Adjust row count'} >
      {/* sub */}
      <button 
        className={[
          'cursor-pointer',
          orientation == Orientation.Horizontal ? '' : `rotate-90`
        ].join(' ')}
        onClick={onDec} >
        <FileMinus />
      </button>
      {/* add */}
      <button 
        className={[
          'cursor-pointer',
          orientation == Orientation.Horizontal ? '' : `rotate-90`
        ].join(' ')}
        onClick={onInc} >
        <FilePlus />
      </button>
    </div>
  )
}