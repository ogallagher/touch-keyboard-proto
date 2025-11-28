import { useContext, useEffect, useRef } from "react"
import { TextAreaEditCtx } from "@context/textAreaCtx"

export default function ComposerTextArea(
  { visible }: {
    visible: boolean
  }
) {
  const textAreaEdit = useContext(TextAreaEditCtx)
  const textArea = useRef(null as unknown as HTMLTextAreaElement)

  // define editor
  useEffect(
    () => {
      textAreaEdit.setTarget(textArea.current)
    },
    [ textAreaEdit ]
  )
  
  // focus to receive keystrokes
  useEffect(
    () => {
      if (visible) {
        textArea.current.focus()
      }
    },
    [ visible ]
  )
  
  return (
    <textarea
      ref={textArea}
      className="field-sizing-content md:field-sizing-fixed md:resize min-w-xs min-h-32 md:min-h-8 max-h-50 font-mono"
      placeholder="composer text area"
      readOnly={true} 
      >
    </textarea>
  )
}