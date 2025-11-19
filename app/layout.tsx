import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "@style/globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Touch Keyboard Proto",
  description: "Configure and test prototype touchscreen keyboards with variable gestures and layouts",
  appleWebApp: {
    title: 'TouchKeyProto'
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html 
      className="dark">
      <body
        className={[
          `${geistSans.variable} ${geistMono.variable} antialiased`,
          'bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50'
        ].join(' ')}
      >
        {children}
      </body>
    </html>
  )
}
