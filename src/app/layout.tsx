import type { Metadata } from "next";
import { LoadingProvider } from "@/contexts/LoadingContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finan Track",
  description: "Financial tracking app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
