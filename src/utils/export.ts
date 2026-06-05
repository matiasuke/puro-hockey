/**
 * Utilidades para exportar datos a diferentes formatos
 */

/**
 * Exporta datos a CSV
 * @param data Array de objetos
 * @param filename Nombre del archivo
 */
export const exportToCSV = (data: any[], filename: string = 'export.csv') => {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Obtener encabezados
  const headers = Object.keys(data[0]);

  // Crear CSV
  let csv = headers.join(',') + '\n';

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Escapar comillas y envolver en comillas si contiene coma
      const stringValue = String(value ?? '');
      const needsQuotes = stringValue.includes(',') || stringValue.includes('"');
      if (needsQuotes) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csv += values.join(',') + '\n';
  });

  // Descargar
  downloadFile(csv, filename, 'text/csv');
};

/**
 * Exporta datos a JSON
 * @param data Array de objetos
 * @param filename Nombre del archivo
 */
export const exportToJSON = (data: any[], filename: string = 'export.json') => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
};

/**
 * Exporta tabla a PDF (requiere html2pdf)
 * @param tableElement Elemento HTML table
 * @param filename Nombre del archivo
 */
export const exportTableToPDF = (
  tableElement: HTMLTableElement,
  filename: string = 'export.pdf'
) => {
  try {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      const element = tableElement.cloneNode(true) as HTMLTableElement;
      const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' },
      };
      (window as any).html2pdf().set(opt).from(element).save();
    };
    document.head.appendChild(script);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
  }
};

/**
 * Descarga un archivo
 * @param content Contenido del archivo
 * @param filename Nombre del archivo
 * @param mimeType Tipo MIME
 */
const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Copia datos a portapapeles
 * @param data Array de objetos
 */
export const copyToClipboard = async (data: any[]) => {
  try {
    const text = data.map((item) => JSON.stringify(item)).join('\n');
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};
