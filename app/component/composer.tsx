import { useContext, useEffect, useRef, useState } from "react"
import { TextAreaEditCtx } from "@context/textAreaCtx"
import { listenerName } from "@lib/eventSync"

export default function ComposerTextArea(
  { visible }: {
    visible: boolean
  }
) {
  const textAreaEdit = useContext(TextAreaEditCtx)
  const textArea = useRef(null as unknown as HTMLTextAreaElement)
  const [composerLocked, setComposerLocked] = useState(true)

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
      if (!textAreaEdit) return

      if (visible) {
        textArea.current.focus()
        
        if (textArea.current.value.length === 0) {
          textAreaEdit.reset()
        }
      }
    },
    [ textAreaEdit, visible ]
  )

  // focus on lock update
  useEffect(
    () => {
      if (!textAreaEdit) return

      const name = listenerName(ComposerTextArea.name)
      textAreaEdit.addLockListener(name, () => {
        const locked = textAreaEdit.locked

        if (visible) {
          textArea.current.focus()
        }
        setComposerLocked(locked)
      })

      return () => textAreaEdit.deleteLockListener(name)
    },
    [ textAreaEdit, visible ]
  )
  
  return (
    <textarea
      ref={textArea}
      name={ComposerTextArea.name}
      className="field-sizing-content md:field-sizing-fixed md:resize min-w-xs min-h-32 md:min-h-8 max-h-50 font-mono"
      placeholder="composer text area"
      readOnly={composerLocked} >
    </textarea>
  )
}