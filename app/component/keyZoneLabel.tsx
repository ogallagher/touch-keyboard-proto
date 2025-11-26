import KeyLabel, { Zone } from "@lib/keyLabel"
import { Direction } from "@lib/orientation"
import { InitGestureSegmentType } from "@lib/touchGesture"

export default function KeyZoneLabel(
  { zone, label, isShift, isCapsLock, gestureSegment }: {
    zone: Zone,
    label: KeyLabel
    isShift: boolean
    isCapsLock: boolean
    gestureSegment: {segment?: InitGestureSegmentType, direction?: Direction}
  }
) {
  return (
    <pre 
      className="text-center flex flex-col justify-center">
      {label.getZone(zone, label.getPseudo(isShift, isCapsLock, gestureSegment.segment), gestureSegment.direction)}
      {/* whitespace to reserve render space when empty */}
      &nbsp;
    </pre>
  )
}