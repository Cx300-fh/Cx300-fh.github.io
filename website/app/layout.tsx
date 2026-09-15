import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Yuxin Li — Computer Vision & World Models',
  description: 'Yuxin Li is an undergraduate at Tsinghua University, Xinya College and the Department of Electronic Engineering, working on computer vision, world models, and harnesses.',
  authors: [{ name: 'Yuxin Li' }],
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<script src="/interactions.js" defer /></body></html>;
}
