"use client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function PDFGenerator({ data, zona, riepilogo }) {
  const generaPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Riepilogo Magazzino", 14, 18);
    doc.setFontSize(12);
    doc.text(`Data consegna: ${data}`, 14, 26);

    let y = 34;
    const zoneDaStampare = zona === "Tutte"
      ? [...new Set(riepilogo.map(r => r.cliente_zona).filter(Boolean))]
      : [zona];

    zoneDaStampare.forEach((zonaCorrente) => {
      const righeZona = riepilogo.filter(r => r.cliente_zona === zonaCorrente);
      if (righeZona.length === 0) return;

      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text(`Zona: ${zonaCorrente}`, 14, y);
      y += 6;

      const gruppiPerCliente = {};
      righeZona.forEach((r) => {
        if (!gruppiPerCliente[r.cliente]) gruppiPerCliente[r.cliente] = [];
        gruppiPerCliente[r.cliente].push(r);
      });

      Object.entries(gruppiPerCliente).forEach(([cliente, righe]) => {
        doc.setFont(undefined, "bold");
        doc.text(cliente, 14, y);
        y += 6;

        const body = righe.map(r => [
          r.prodotto,
          r.quantita,
          r.peso_effettivo ?? "-",
          r.preparato ? "✓" : "✗",
          r.operatore ?? "-"
        ]);

        const risultato = autoTable(doc, {
          head: [["Prodotto", "Quantità", "Peso", "Preparato", "Operatore"]],
          body,
          startY: y,
          styles: { fontSize: 10 },
          headStyles: { fillColor: [52, 152, 219] },
          margin: { left: 14, right: 14 },
        });

        y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y + 10;
      });
    });

    doc.save(`riepilogo-${data}.pdf`);
  };

  return (
    <button
      onClick={generaPDF}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      📄 Stampa PDF
    </button>
  );
}