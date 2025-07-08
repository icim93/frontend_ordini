"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { api } from "../../lib/api";

export default function ImportaClienti() {
  const [clienti, setClienti] = useState([]);
  const [fileName, setFileName] = useState("");

  const gestisciFile = (file) => {
    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      if (file.name.endsWith(".xlsx")) {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet);
        setClienti(json);
      } else if (file.name.endsWith(".csv")) {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => setClienti(results.data),
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

  const salvaClienti = () => {
    api
      .post("/importa-clienti", clienti)
      .then(() => alert("Clienti importati con successo!"))
      .catch(() => alert("Errore durante l'importazione."));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Importa Clienti</h1>

      <input
        type="file"
        accept=".csv,.xlsx"
        onChange={(e) => gestisciFile(e.target.files[0])}
        className="mb-4"
      />

      {fileName && <p className="mb-2">File selezionato: {fileName}</p>}

      {clienti.length > 0 && (
        <>
          <table className="w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-200">
                {Object.keys(clienti[0]).map((col) => (
                  <th key={col} className="border p-2">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clienti.map((riga, idx) => (
                <tr key={idx}>
                  {Object.values(riga).map((val, i) => (
                    <td key={i} className="border p-2">{val}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={salvaClienti}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Salva Clienti nel Database
          </button>
        </>
      )}
    </div>
  );
}