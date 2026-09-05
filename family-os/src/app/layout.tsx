import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import ThemeSync from "./ThemeSync";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Family OS",
  description: "The operating system for your household — appointments, documents, bills, and more, in one place for the whole family.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Family OS",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#8b7cf6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeSync />
        {children}
      </body>
    </html>
  );
}
