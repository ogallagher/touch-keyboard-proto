'use client'

import Image from "next/image"
import { websiteBasePath } from "@lib/path"
import Header from "@component/header"
import KeyGrid from "@component/keyGrid"
import GridDimensions from "@lib/gridDimensions"
import IncDec from "@component/incDec"
import { Orientation } from "@lib/orientation"
import { useState } from "react"

export default function Home() {
  const [gridDimensions, setGridDimensions] = useState(new GridDimensions(1, 1))
  
  return (
    <div 
      className="min-h-screen flex flex-col justify-start gap-2">
      <Header />

      <div
        className="flex flex-row justify-evenly gap-1 text-2xl">
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

      <KeyGrid dimensions={gridDimensions} />
    </div>
  )
}
