'use client';

import { usePathname } from 'next/navigation';
import localFont from 'next/font/local';
import './globals.css';
import TheBar from './component/TheBar';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className={`app-layout ${isAuthPage ? 'auth-layout' : ''}`}>
     
          {!isAuthPage && (
            <aside className="sidebar">
              <TheBar />
            </aside>
          )}
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
