import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { FirebaseAuthProvider } from "@/components/FirebaseAuthProvider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Word Fishing 一語多吃",
  description: "一語多吃 - 開啟語言學習全新模式，累積語言感應力",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{overflow: "hidden"}}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          <ClerkProvider dynamic>
            <FirebaseAuthProvider>
              {children}
              <Toaster />
            </FirebaseAuthProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
