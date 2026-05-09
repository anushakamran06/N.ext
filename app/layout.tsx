import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'N.ext — NUS Opportunity Feed',
  description:
    'Never miss a Canvas deadline, TalentConnect internship, scholarship, or hackathon again. N.ext aggregates every NUS opportunity into one Chrome notification feed.',
  openGraph: {
    title: 'N.ext — NUS Opportunity Feed',
    description: 'One Chrome extension. Every opportunity at NUS.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'N.ext — NUS Opportunity Feed',
    description: 'One Chrome extension. Every opportunity at NUS.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
