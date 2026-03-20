import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import { FileSystemProvider } from "../contexts/FileSystemContext";

const inter = Inter({ subsets: ["latin"] });
const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Retro Portfolio",
  description: "A retro OS inspired portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${spaceMono.className} antialiased`}>
        <FileSystemProvider>
          {children}
        </FileSystemProvider>
      </body>
    </html>
  );
}
