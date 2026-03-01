import type { Metadata, Viewport } from 'next'
import { Poppins, Inter, Nunito_Sans } from 'next/font/google'
import './globals.css'
import RQProviders from '@/utils/provider'
import { Providers } from './Provider'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ajiroba.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ajiroba Admin',
    template: '%s | Ajiroba Admin',
  },
  description: 'Ajiroba admin dashboard for managing products, auctions, transactions, and customer operations.',
  keywords: ['Ajiroba', 'admin', 'dashboard', 'auctions', 'e-commerce', 'Nigeria'],
  authors: [{ name: 'Ajiroba' }],
  creator: 'Ajiroba',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: siteUrl,
    siteName: 'Ajiroba Admin',
    title: 'Ajiroba Admin',
    description: 'Ajiroba admin dashboard for managing products, auctions, and transactions.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ajiroba Admin',
    description: 'Ajiroba admin dashboard.',
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  verification: {},
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#F25E26',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '900'],
  display: "swap", // Optional: Ensure consistency across all fonts
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '900'],
  display: "swap",
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '900'],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <RQProviders>
        <body className={`${poppins.className} ${nunitoSans.className} ${inter.className}`} suppressHydrationWarning>
          <ToastContainer closeOnClick limit={1} />
          <Providers>
            {children}
          </Providers>
        </body>
      </RQProviders>
    </html>
  );
}

