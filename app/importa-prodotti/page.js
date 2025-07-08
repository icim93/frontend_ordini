"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { api } from "../../lib/api";

export default function ImportaProdotti() {
  const [prodotti, setProdotti] = useState([]);
  const [fileName, setFileName] = useState("");

  const gestisciFile = (file) => {
    setFileName(file.name);

    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      if (file.name.endsWith(".xlsx")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
        setProdotti(json);
      } else if (file.name.endsWith(".csv")) {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setProdotti(results.data);
          },
        });
      } else {
        alert("Formato file non supportato (.csv o .xlsx)");
      }
    };

    if (file.name.endsWith(".xlsx")) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file);
    }
  };

  const salvaProdotti = () => {
    api
      .post("/importa-prodotti", prodotti)
      .then(() => alert("Prodotti importati con successo!"))
      .catch(() => alert("Errore durante l'importazione."));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Importa Prodotti</h1>

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => gestisciFile(e.target.files[0])}
        className="mb-4"
      />

      {fileName && <p className="mb-2">File selezionato: {fileName}</p>}

      {prodotti.length > 0 && (
        <>
          <table className="w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(prodotti[0]).map((col) => (
                  <th key={col} className="border p-2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {prodotti.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((val, i) => (
                    <td key={i} className="border p-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={salvaProdotti}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Salva Prodotti nel Database
          </button>
        </>
      )}
    </div>
  );
}