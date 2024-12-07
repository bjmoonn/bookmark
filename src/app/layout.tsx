import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation/index'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Bookmark',
  description: 'Bookmark links',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <div className="wrapper">
          <Navigation />
          {children}
        </div>
      </body>
    </html>
  )
}
