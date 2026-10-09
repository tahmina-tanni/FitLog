import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
export const metadata: Metadata = { title: 'FitLog — Workout Library', description: 'Train with intent. Log every set.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><StoreProvider><Navbar/><main>{children}</main><Footer/></StoreProvider></body></html>; }
