
import type {Metadata} from 'next';
import { Inter } from 'next/font/google' // Use standard Inter font
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

const inter = Inter({ subsets: ['latin'] }) // Initialize Inter

export const metadata: Metadata = {
  title: 'Daily Quiz App', // Updated title
  description: 'A simple daily quiz application', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Use Inter font class */}
      <body className={`${inter.className} antialiased bg-secondary`}>
        {/* Adjust main padding/margin as needed */}
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster /> {/* Add Toaster for feedback */}
      </body>
    </html>
  );
}