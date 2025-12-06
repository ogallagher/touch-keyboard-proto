import IncDec from "@component/incDec"
import { ConfigCtx } from "@context/configCtx"
import GridDimensions from "@lib/gridDimensions"
import { constrainKeyDimensions, constrainKeyIndex, KeyIndex } from "@lib/keyboardDefinition"
import { Orientation } from "@lib/orientation"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { BoundingBoxCircles } from "react-bootstrap-icons"

export default function ConfigKeyCellBounds(
  { index, setIndex, dimensions, setDimensions, isShadow }: {
    index: KeyIndex|undefined,
    setIndex: Dispatch<SetStateAction<KeyIndex|undefined>>
    dimensions: GridDimensions|undefined,
    setDimensions: Dispatch<SetStateAction<GridDimensions|undefined>>
    isShadow: boolean
  }
) {
  const configCtx = useContext(ConfigCtx)
  const [showBounds, setShowBounds] = useState(false)

  const moveIndex = (delta: KeyIndex) => {
    if (!index || !dimensions || !configCtx?.keyboardInstance) return

    const validKeyIndex = constrainKeyIndex(
      {
        row: index.row + delta.row,
        col: index.col + delta.col
      }, 
      dimensions, 
      configCtx.keyboardInstance.keyboard.dimensions
    )

    setIndex(validKeyIndex)
  }

  const resizeDimensions = (delta: GridDimensions) => {
    if (!index || !dimensions || !configCtx?.keyboardInstance) return

    const validDimensions = constrainKeyDimensions(
      index, 
      new GridDimensions(
        dimensions.width + delta.width,
        dimensions.height + delta.height
      ), 
      configCtx.keyboardInstance.keyboard.dimensions
    )

    setDimensions(validDimensions)
  }

  return isShadow || !dimensions ? undefined : (
    <div className='flex flex-row justify-center'>
      <div 
        className={[
          'grid gap-1',
          `grid-cols-${showBounds ? 3 : 1} grid-rows-${showBounds ? 3 : 1}`,
          'my-auto'
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
              onDec={() => moveIndex({col: 0, row: -1})}
              onInc={() => moveIndex({col: 0, row: +1})} />
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
              onDec={() => moveIndex({col: -1, row: 0})}
              onInc={() => moveIndex({col: +1, row: 0})} />
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
            onDec={() => resizeDimensions(new GridDimensions(-1, 0))}
            onInc={() => resizeDimensions(new GridDimensions(+1, 0))} />
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
            onDec={() => resizeDimensions(new GridDimensions(0, -1))}
            onInc={() => resizeDimensions(new GridDimensions(0, +1))} />
        </div>
      </div>
    </div>
  )
}