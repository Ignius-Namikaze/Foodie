// app/layout.jsx
import './globals.css' // Includes Tailwind styles
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Awesome Food Reviews', // Change Title
  description: 'Personal ratings and reviews of restaurants I visit.', // Change Description
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <main>{children}</main>
        <footer className="text-center py-4 mt-12 text-gray-500 text-sm">
            Built by Ignius_Namikaze - All opinions are my own!
        </footer>
      </body>
    </html>
  )
}