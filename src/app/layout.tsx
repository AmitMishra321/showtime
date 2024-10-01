import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from '@/trpc/clients/client'
import { Container } from '@/components/atoms/container'
import { Toaster } from '@/components/molecules/Toaster/toaster'
import { Navbar } from '@/components/organisms/Navbar'
import 'mapbox-gl/dist/mapbox-gl.css'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShowTime!',
  description: 'Movie ticket booking app | AMIT MISHRA',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>
        <html lang="en">
          <body className={inter.className}>
            <Toaster />
            <Navbar />
            <Container>{children}</Container>
          </body>
        </html>
      </TRPCReactProvider>
    </ClerkProvider>
  )
}
