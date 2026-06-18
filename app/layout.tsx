import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'DocuMind AI - Document Q&A Platform',
  description: 'AI-powered document analysis and question answering',
  generator: 'v0.app',
  icons: {
    // Adding ?v=1 forces browsers to clear their cached icon memory instantly
    icon: '/icon-light-32x32.png?v=1',
    apple: '/apple-icon.png?v=1',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <DashboardLayout>{children}</DashboardLayout>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
