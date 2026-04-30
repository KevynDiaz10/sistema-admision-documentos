import React from 'react'
import "./style/globals.css"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
 
export const metadata: Metadata = {
  title: 'IUTA APP',
  description: '...',
  icons: ""
}
const interFont = Inter({ subsets: ['latin'] }) 
export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <html>
            <body className={`bg-[#D6D6E6] ${interFont.className}`}>
                {children}
            </body>
        </html>
    )
}