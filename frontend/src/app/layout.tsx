import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ToastProvider from "@/components/ToastProvider";
import { SearchProvider } from '@/lib/searchContext';

export const metadata: Metadata = {
  title: "Highway Delite - Book Your Adventure",
  description: "Book amazing experiences and adventures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ backgroundColor: 'var(--bg)' }}>
        <SearchProvider>
          <Header />
          <ToastProvider />
          <main className="min-h-screen">
            <div className="app-container">
              {children}
            </div>
          </main>

          <footer className="border-t border-gray-100 bg-transparent py-8 mt-12">
            <div className="app-container flex items-center justify-between text-sm text-gray-600">
              <span>© {new Date().getFullYear()} Highway Delite</span>
              <div className="flex items-center gap-4">
                <a href="/about" className="text-gray-600 hover:underline">About</a>
                <a href="/terms" className="text-gray-600 hover:underline">Terms</a>
              </div>
            </div>
          </footer>
        </SearchProvider>
      </body>
    </html>
  );
}
