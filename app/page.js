"use client";

import Link from "next/link";

export default function Home() {
  const sezioni = [
    { label: "➕ Nuovo Ordine", href: "/nuovo-ordine" },
    { label: "📦 Riepilogo Magazzino", href: "/riepilogo" },
    { label: "🧾 Storico Ordini", href: "/storico" },
    { label: "🧍 Importa Clienti", href: "/importa-clienti" },
    { label: "🧀 Importa Prodotti", href: "/importa-prodotti" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-900 text-center">
        ✅ Dashboard Ordini Online
      </h1>
      <p className="mb-6 text-center">Benvenuto, seleziona una sezione dal menu.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
        {sezioni.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className="block bg-white border border-yellow-500 text-blue-900 rounded-lg px-4 py-3 text-center text-base font-semibold shadow hover:bg-yellow-100 hover:text-yellow-800 transition"
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}