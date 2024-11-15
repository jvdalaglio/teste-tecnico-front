import type { Metadata } from "next";
import { LoadingProvider } from "@/contexts/LoadingContext";
import "./globals.css";
import LoadingWrapper from "./components/loadingWrapper/loadingWrapper";

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
          <LoadingWrapper/>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
