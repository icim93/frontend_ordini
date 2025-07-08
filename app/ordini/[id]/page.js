"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../../lib/api";

export default function DettaglioOrdine() {
  const params = useParams();
  const id = params.id;
  const [ordine, setOrdine] = useState(null);
  const [errore, setErrore] = useState(null);

  useEffect(() => {
    api
      .get(`/ordini/${id}`)
      .then((res) => setOrdine(res.data))
      .catch((err) => setErrore("Errore nel caricamento dell'ordine."));
  }, [id]);

  if (errore) return <p className="p-6 text-red-600">{errore}</p>;
  if (!ordine) return <p className="p-6">Caricamento...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Ordine #{ordine.id}</h1>
      <p className="mb-1">Cliente: <strong>{ordine.cliente}</strong></p>
      <p className="mb-1">Data: <strong>{ordine.data_ordine}</strong></p>
      <p className="mb-4">Operatore: <strong>{ordine.operatore || "-"}</strong></p>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Prodotto</th>
            <th className="border p-2">Quantità</th>
            <th className="border p-2">Peso Effettivo</th>
            <th className="border p-2">Preparato</th>
          </tr>
        </thead>
        <tbody>
          {ordine.prodotti.map((p, idx) => (
            <tr key={idx}>
              <td className="border p-2">{p.nome}</td>
              <td className="border p-2">{p.quantita}</td>
              <td className="border p-2">{p.peso_effettivo ?? "-"}</td>
              <td className="border p-2 text-center">{p.preparato ? "✓" : "✗"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
