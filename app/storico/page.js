"use client";
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function StoricoOrdini() {
  const [ordini, setOrdini] = useState([]);

  useEffect(() => {
    api.get('/ordini').then(res => setOrdini(res.data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Storico Ordini</h1>

      {ordini.length === 0 ? (
        <p>Nessun ordine presente.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Autista</th>
              <th className="border p-2">Data</th>
              <th className="border p-2">Stato</th>
              <th className="border p-2"># Prodotti</th>
              <th className="border p-2">Dettagli</th>
            </tr>
          </thead>
          <tbody>
            {ordini.map((o) => (
              <tr key={o.id}>
                <td className="border p-2">{o.id}</td>
                <td className="border p-2">{o.cliente}</td>
                <td className="border p-2 text-blue-800 italic">{o.autista}</td>
                <td className="border p-2">{o.data_ordine}</td>
                <td className="border p-2">{o.stato}</td>
                <td className="border p-2">{o.num_prodotti}</td>
                <td className="border p-2 text-center">
                  <a
                    href={`/ordini/${o.id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    Visualizza
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}