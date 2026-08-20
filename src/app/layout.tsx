import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'ANP MART',
  description: 'Your neighbourhood grocery store',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#16a34a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 pb-16 lg:pb-0">
          {children}
        </div>
      </body>
    </html>
  );
}
