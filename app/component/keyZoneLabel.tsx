import KeyLabel, { Zone, ZoneKey } from "@lib/keyLabel"
import { Direction } from "@lib/orientation"
import { InitGestureSegmentType } from "@lib/touchGesture"
import { Dispatch, SetStateAction } from "react"

export default function KeyZoneLabel(
  { zone, label, isShift, isCapsLock, gestureSegment, setKeyLabel }: {
    zone: Zone,
    label: KeyLabel|undefined
    isShift: boolean
    isCapsLock: boolean
    gestureSegment: {segment?: InitGestureSegmentType, direction?: Direction}|undefined
    setKeyLabel?: Dispatch<SetStateAction<KeyLabel | undefined>>
  }
) {
  const zoneLabel = label?.getZone(zone, label.getPseudo(isShift, isCapsLock, gestureSegment?.segment), gestureSegment?.direction)

  return (
    <div className='flex flex-row justify-center'>
      <input 
        className={[
          'field-sizing-content flex flex-col justify-center font-mono',
          setKeyLabel ? 'select-all' : 'pointer-none cursor-default',
          zoneLabel === undefined ? 'min-w-4' : ''
        ].join(' ')}
        value={zoneLabel || '  '}
        onChange={setKeyLabel && label && ( (e) => {
          const newLabel = label.clone()
          newLabel.set(new ZoneKey(zone), e.target.value.trim() === '' ? undefined : e.target.value)

          setKeyLabel(newLabel)
        } )}
        readOnly={setKeyLabel ? undefined : true} />
    </div>
  )
}