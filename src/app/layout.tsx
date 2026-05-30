import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "CardioSense AI | Premium Cardiovascular Screening",
  description: "Medical-grade heart health intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={`${instrumentSerif.variable} antialiased h-full`}>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-body: 'Satoshi', sans-serif;
          }
        `}</style>
      </head>
      <body className="min-h-full flex flex-col m-0 p-0">
        <AuthProvider>
          <header className="w-full">
            {/* Semantic Header */}
          </header>
          
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          
          <footer className="w-full">
            {/* Semantic Footer */}
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
