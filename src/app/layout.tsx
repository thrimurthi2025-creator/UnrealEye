import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { LiquidBackground } from '@/components/ui/liquid-background';

export const metadata: Metadata = {
  title: 'Unreal Eye — Next-Gen AI Forensics',
  description: 'Advanced neural network forensics to distinguish AI-generated content from reality with crystal clarity and precision.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head />
      <body>
        <LiquidBackground />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main className="relative z-10">{children}</main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
