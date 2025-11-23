import { Gear, Play } from "react-bootstrap-icons"
import TextArea from "@component/textArea"
import IncDec from "./incDec"
import GridDimensions from "@lib/gridDimensions"
import { Dispatch, RefObject, SetStateAction, useState } from "react"
import { EditTextArea } from "@context/textAreaCtx"
import { Orientation } from "@lib/orientation"
import { ConfigEvalMode } from "@lib/control"

export default function ConfigEvalSection(
  { gridDimensions, setGridDimensions, textAreaEdit }: {
    gridDimensions: GridDimensions,
    setGridDimensions: Dispatch<SetStateAction<GridDimensions>>
    textAreaEdit: RefObject<EditTextArea>
  }
) {
  const [mode, setMode] = useState(ConfigEvalMode.Eval)

  return (
    <div className="relative pointer-none">
      {/* eval mode */}
      <section
        className={[
          'flex-row justify-evenly',
          mode === ConfigEvalMode.Eval ? 'flex' : 'hidden' 
        ].join(' ')} >
        <TextArea edit={textAreaEdit} visible={mode === ConfigEvalMode.Eval} />
      </section>

      {/* config mode */}
      <div
        className={[
          'flex-row justify-evenly gap-1 text-2xl',
          mode === ConfigEvalMode.Config ? 'flex' : 'hidden'
        ].join(' ')}>
        {/* config grid dimensions.width */}
        <IncDec
          orientation={Orientation.Horizontal} 
          onDec={() => setGridDimensions(gridDimensions.colAdd(-1))}
          onInc={() => setGridDimensions(gridDimensions.colAdd(+1))} />
        {/* config grid dimensions.height */}
        <IncDec 
          orientation={Orientation.Vertical}
          onDec={() => setGridDimensions(gridDimensions.rowAdd(-1))}
          onInc={() => setGridDimensions(gridDimensions.rowAdd(+1))} />
      </div>

      {/* switch between modes */}
      <button 
        className="absolute bottom-0 right-0 p-4 cursor-pointer" 
        onClick={() => {
          if (mode === ConfigEvalMode.Eval) {
            setMode(ConfigEvalMode.Config)
          }
          else {
            setMode(ConfigEvalMode.Eval)
          }
        }} >
        {mode === ConfigEvalMode.Eval ? <Gear /> : <Play />}
      </button>
    </div>
  )
}