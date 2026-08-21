import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ANP MART',
  description: 'Your neighbourhood grocery store',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0c831f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-mulish antialiased">{children}</body>
    </html>
  );
}