import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import MobileNav from '@/components/layout/MobileNav/MobileNav';
import PageTransition from '@/components/layout/PageTransition';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'KrishiRakshak AI | Agricultural Intelligence Platform',
  description: 'Advanced computer vision and predictive modeling for agricultural security. Detect, predict and prevent crop threats across Maharashtra.',
  keywords: 'AgriTech, crop disease, AI, agriculture, Maharashtra, farm intelligence',
  openGraph: {
    title: 'KrishiRakshak AI',
    description: 'Agricultural Intelligence Platform for India',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body>
        <PageTransition>
          {children}
        </PageTransition>
        <MobileNav />
      </body>
    </html>
  );
}
