import type { Metadata } from 'next';
import './globals.css';
import { BookProvider } from '../context/BookContext'; // Adjust path as needed

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <BookProvider>
          {children}
        </BookProvider>
      </body>
    </html>
  );
}
