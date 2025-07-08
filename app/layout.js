import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Gestione Ordini",
  description: "Web App aziendale per la gestione degli ordini",
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body className="bg-gray-50 text-gray-900">
        <header className="bg-gradient-to-r from-blue-800 to-yellow-500 flex flex-wrap items-center justify-between px-4 py-3 shadow text-white">
          <div className="flex items-center gap-3 w-full md:w-auto mb-2 md:mb-0">
            <img src="/logo.png" alt="Logo" className="h-8 md:h-10 w-auto" />
            <h1 className="text-lg md:text-xl font-bold">Gestione Ordini</h1>
          </div>
          <Link
            href="/"
            className="bg-white text-blue-800 px-3 py-1 rounded text-sm md:text-base hover:bg-yellow-100 hover:text-yellow-700 transition"
          >
            🏠 Home
          </Link>
        </header>

        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}