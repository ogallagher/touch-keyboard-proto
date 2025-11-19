import Image from "next/image"
import { websiteBasePath } from "@lib/path"
import Header from "@component/header"

export default function Home() {
  return (
    <div 
      className="min-h-screen">
      <Header />

      <pre>touch-keyboard-proto</pre>
    </div>
  )
}
