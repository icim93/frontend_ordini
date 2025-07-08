"use client";
import { useState, useEffect } from "react";
import { api } from "../../lib/api";
import dynamic from "next/dynamic";

const PDFGenerator = dynamic(() => import("@/components/PDFGenerator"), {
  ssr: false,
});

export default function Riepilogo() {
  const [data, setData] = useState(() => {
    const oggi = new Date();
    return oggi.toISOString().split("T")[0];
  });

  const [riepilogo, setRiepilogo] = useState([]);
  const [zona, setZona] = useState("Tutte");
  const [zoneDisponibili, setZoneDisponibili] = useState([]);

  const caricaRiepilogo = () => {
    api
      .post("/ordini-per-giorno", { data })
      .then((res) => {
        setRiepilogo(res.data);
        const zoneUniche = [...new Set(res.data.map(r => r.cliente_zona).filter(Boolean))];
        setZoneDisponibili(zoneUniche);
      })
      .catch(() => alert("Errore nel caricamento del riepilogo."));
  };

  const aggiornaRiga = (id_riga, dati) => {
    api
      .patch(`/dettagli-ordine/${id_riga}`, dati)
      .then(() => console.log("✅ Aggiornato ID", id_riga))
      .catch(() => alert("Errore nel salvataggio"));
  };

  useEffect(() => {
    caricaRiepilogo();
  }, [data]);

  const riepilogoFiltrato = zona === "Tutte"
    ? riepilogo
    : riepilogo.filter(r => r.cliente_zona === zona);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Riepilogo Magazzino</h1>

      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label>
          Data:
          <input
            type="date"
            className="ml-2 border px-2 py-1"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </label>

        <label>
          Zona:
          <select
            className="ml-2 border px-2 py-1"
            value={zona}
            onChange={(e) => setZona(e.target.value)}
          >
            <option value="Tutte">Tutte</option>
            {zoneDisponibili.map((z, idx) => (
              <option key={idx} value={z}>{z}</option>
            ))}
          </select>
        </label>

        <PDFGenerator data={data} zona={zona} riepilogo={riepilogo} />
      </div>

      {riepilogoFiltrato.length === 0 ? (
        <p className="mt-4">Nessun ordine per la data e zona selezionate.</p>
      ) : (
        <table className="w-full border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Prodotto</th>
              <th className="border p-2">Quantità</th>
              <th className="border p-2">Peso effettivo</th>
              <th className="border p-2">Preparato</th>
              <th className="border p-2">Operatore</th>
            </tr>
          </thead>
          <tbody>
            {riepilogoFiltrato.map((r, idx) => (
              <tr key={idx}>
                <td className="border p-2">{r.cliente}</td>
                <td className="border p-2">{r.prodotto}</td>
                <td className="border p-2">{r.quantita}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={r.peso_effettivo ?? ""}
                    className="border px-2 py-1 w-24"
                    onBlur={(e) =>
                      aggiornaRiga(r.id_riga, {
                        peso_effettivo: parseFloat(e.target.value || 0),
                        preparato: r.preparato,
                      })
                    }
                  />
                </td>
                <td className="border p-2 text-center">
                  <input
                    type="checkbox"
                    defaultChecked={r.preparato}
                    onChange={(e) =>
                      aggiornaRiga(r.id_riga, {
                        peso_effettivo: r.peso_effettivo,
                        preparato: e.target.checked,
                      })
                    }
                  />
                </td>
                <td className="border p-2">{r.operatore ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}