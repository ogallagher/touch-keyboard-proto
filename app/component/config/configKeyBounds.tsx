import IncDec from "@component/incDec"
import GridDimensions from "@lib/gridDimensions"
import { KeyIndex } from "@lib/keyboardDefinition"
import { Orientation } from "@lib/orientation"
import { Dispatch, RefObject, SetStateAction, useState } from "react"
import { BoundingBoxCircles } from "react-bootstrap-icons"

export default function ConfigKeyCellBounds(
  { index, setIndex, dimensions, setDimensions }: {
    index?: KeyIndex,
    setIndex: Dispatch<SetStateAction<KeyIndex|undefined>>
    dimensions: GridDimensions,
    setDimensions: Dispatch<SetStateAction<GridDimensions|undefined>>
  }
) {
  const [showBounds, setShowBounds] = useState(false)

  return (
    <div className='flex flex-row justify-center'>
      <div 
        className={[
          'grid gap-1',
          `grid-cols-${showBounds ? 3 : 1} grid-rows-${showBounds ? 3 : 1}`
        ].join(' ')}>
        {/* index.row */}
        <div 
          style={{
            gridColumnStart: 2,
            gridRowStart: 1
          }}
          className={showBounds ? '' : 'hidden'} >
          {
            !setIndex || !index ? undefined :
            <IncDec 
              orientation={Orientation.Vertical}
              title='Row start'
              onDec={() => setIndex({col: index.col, row: index.row-1})}
              onInc={() => setIndex({col: index.col, row: index.row+1})} />
          }
        </div>
        {/* index.col */}
        <div 
          style={{
            gridColumnStart: 1,
            gridRowStart: 2
          }}
          className={showBounds ? '' : 'hidden'} >
          {
            !setIndex || !index ? undefined :
            <IncDec 
              orientation={Orientation.Horizontal}
              title='Col start'
              onDec={() => setIndex({col: index.col-1, row: index.row})}
              onInc={() => setIndex({col: index.col+1, row: index.row})} />
          }
        </div>
        {/* key bounds icon */}
        <div 
          style={{
            gridColumnStart: 2,
            gridRowStart: 2
          }}
          className='text-3xl cursor-pointer'
          title='Key cell bounds'
          onClick={() => {
            setShowBounds(!showBounds)
          }} >
          <BoundingBoxCircles className='mx-auto h-full' />
        </div>
        {/* dimensions.col */}
        <div 
          style={{
            gridColumnStart: 3,
            gridRowStart: 2
          }}
          className={showBounds ? '' : 'hidden'} >
          <IncDec 
            orientation={Orientation.Horizontal}
            title='Col end'
            onDec={() => setDimensions(dimensions?.colAdd(-1))}
            onInc={() => setDimensions(dimensions?.colAdd(+1))} />
        </div>
        {/* dimensions.row */}
        <div 
          style={{
            gridColumnStart: 2,
            gridRowStart: 3
          }}
          className={showBounds ? '' : 'hidden'} >
          <IncDec 
            orientation={Orientation.Vertical}
            title='Row end'
            onDec={() => setDimensions(dimensions?.rowAdd(-1))}
            onInc={() => setDimensions(dimensions?.rowAdd(+1))} />
        </div>
      </div>
    </div>
  )
}