"use client";
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function ProdottiLista() {
  const [prodotti, setProdotti] = useState([]);

  useEffect(() => {
    api.get('/prodotti')
      .then(res => setProdotti(res.data))
      .catch(err => console.error("Errore nel caricamento prodotti:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista Prodotti</h1>
      <ul className="list-disc pl-5">
        {prodotti.map(p => (
          <li key={p.id}>
            <strong>{p.nome}</strong> ({p.codice})
          </li>
        ))}
      </ul>
    </div>
  );
}