"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function NuovoOrdine() {
  const [clienti, setClienti] = useState([]);
  const [prodotti, setProdotti] = useState([]);
  const [clienteSelezionato, setClienteSelezionato] = useState("");
  const [operatoreSelezionato, setOperatoreSelezionato] = useState("");
  const [righeOrdine, setRigheOrdine] = useState([]);

  useEffect(() => {
    api.get("/clienti").then(res => setClienti(res.data));
    api.get("/prodotti").then(res => setProdotti(res.data));
  }, []);

  const aggiungiRiga = () => {
    setRigheOrdine([...righeOrdine, { id_prodotto: "", quantita: 1 }]);
  };

  const aggiornaRiga = (index, campo, valore) => {
    const nuoveRighe = [...righeOrdine];
    nuoveRighe[index][campo] = valore;
    setRigheOrdine(nuoveRighe);
  };

  const rimuoviRiga = (index) => {
    const nuoveRighe = [...righeOrdine];
    nuoveRighe.splice(index, 1);
    setRigheOrdine(nuoveRighe);
  };

  const inviaOrdine = async () => {
    if (!clienteSelezionato || !operatoreSelezionato || righeOrdine.length === 0) {
      alert("Compila tutti i campi prima di inviare.");
      return;
    }

    try {
      await api.post("/ordini", {
        id_cliente: clienteSelezionato,
        righe: righeOrdine,
        operatore: operatoreSelezionato,
      });
      alert("✅ Ordine inserito con successo!");
      // reset
      setClienteSelezionato("");
      setOperatoreSelezionato("");
      setRigheOrdine([]);
    } catch (err) {
      console.error("Errore invio ordine:", err);
      alert("Errore durante l'invio dell'ordine");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nuovo Ordine</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <label>
          Cliente:
          <select
            className="w-full border p-2"
            value={clienteSelezionato}
            onChange={(e) => setClienteSelezionato(e.target.value)}
          >
            <option value="">-- Seleziona cliente --</option>
            {clienti.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </label>

        <label>
          Operatore:
          <select
            className="w-full border p-2"
            value={operatoreSelezionato}
            onChange={(e) => setOperatoreSelezionato(e.target.value)}
          >
            <option value="">-- Seleziona operatore --</option>
            <option value="Marco">Marco</option>
            <option value="Franco">Franco</option>
            <option value="Avossa">Avossa</option>
            <option value="Pascale">Pascale</option>
            <option value="Fornaro">Fornaro</option>
          </select>
        </label>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Prodotti</h2>
      {righeOrdine.map((riga, index) => (
        <div key={index} className="flex gap-2 mb-2 items-center">
          <select
            className="border p-2 flex-1"
            value={riga.id_prodotto}
            onChange={(e) => aggiornaRiga(index, "id_prodotto", e.target.value)}
          >
            <option value="">-- Seleziona prodotto --</option>
            {prodotti.map(p => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            className="border p-2 w-24"
            value={riga.quantita}
            onChange={(e) => aggiornaRiga(index, "quantita", e.target.value)}
          />

          <button
            onClick={() => rimuoviRiga(index)}
            className="text-red-600 font-bold text-lg"
            title="Rimuovi riga"
          >
            ✖
          </button>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <button
          onClick={aggiungiRiga}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          ➕ Aggiungi prodotto
        </button>

        <button
          onClick={inviaOrdine}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📤 Invia ordine
        </button>
      </div>
    </div>
  );
}