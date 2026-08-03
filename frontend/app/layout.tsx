import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Insurance Cross-Sell AI Advisor',
  description: 'AI-assisted dashboard analyzing customer insurance portfolios, identifying coverage gaps using rules-based logic, and generating compliant WhatsApp cross-sell messages.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-cyan-500 selection:text-slate-950">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500 bg-slate-950">
          <p>Insurance Cross-Sell AI Advisor • 3-Tier Architecture (Express.js API + Next.js UI + Supabase DB)</p>
        </footer>
      </body>
    </html>
  );
}
