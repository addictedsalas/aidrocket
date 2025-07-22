import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Aid Rocket - No-BS Home Buying Advisor',
  description: 'Get honest breakdowns of cash-to-close, monthly payments, and assistance programs. One input, one minute, one truth.',
  keywords: 'home buying, down payment assistance, mortgage calculator, first time home buyer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}