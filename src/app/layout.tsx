import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreInitializer } from "@/components/store-initializer";
import { TopLoader } from "@/components/top-loader";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const storeConfig = await prisma.storeConfig.findFirst().catch(() => null);
  return {
    title: {
      default: storeConfig?.storeName || "My Online Shop",
      template: `%s | ${storeConfig?.storeName || "My Online Shop"}`,
    },
    description: storeConfig?.storeDescription || "Welcome to our premium online shop",
    keywords: ["online shop", "e-commerce", "shopping", "products"],
    authors: [{ name: storeConfig?.storeName }],
    creator: storeConfig?.storeName,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: storeConfig?.storeName,
      title: storeConfig?.storeName,
      description: storeConfig?.storeDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeConfig = await prisma.storeConfig.findFirst().catch(() => null);
  const primaryColor = storeConfig?.primaryColor || "#6366f1";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense fallback={null}>
            <TopLoader />
          </Suspense>
          <StoreInitializer primaryColor={primaryColor} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
