import './globals.css';
import 'katex/dist/katex.min.css';
import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'GSEB Learning Hub | Class 12 Mathematics', description: 'Interactive Gujarati and English mathematics study companion' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
