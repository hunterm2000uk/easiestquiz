import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'QuickFire Quiz', // Updated title
  description: 'Daily quickfire quiz challenges.', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Added main container with flex layout */}
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
          {children}
        </main>
        <Toaster /> {/* Add Toaster for feedback */}
      </body>
    </html>
  );
}
