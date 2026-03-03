import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BRD Transformer | Document to Audience-Ready Formats",
  description:
    "Transform template-driven business requirement documents into TLDR, podcast-style, or human-readable formats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)] relative"
        style={{
          backgroundImage: "url(/doc-transform-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div
          className="absolute inset-0 bg-black/80"
          aria-hidden
        />
        <div className="relative">{children}</div>
      </body>
    </html>
  );
}
