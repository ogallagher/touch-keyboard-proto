import KeyLabel from "@lib/keyLabel"

export default function KeyCell(
  { label }: {
    label: KeyLabel
  }
) {

  return (
    <div
      className={[
        'dark:bg-zinc-900 dark:hover:bg-zinc-800 bg-zinc-100 hover:bg-zinc-200',
        'select-none',
        'grow',
        'flex flex-col justify-center text-center',
        'rounded-lg'
      ].join(' ')}>
      <span>{label.center}</span>
    </div>
  )
}