/**
 * Utilidades para importar datos desde diferentes formatos
 */

export interface ImportResult<T> {
  success: boolean;
  data: T[];
  errors: string[];
  rowsProcessed: number;
}

/**
 * Importa datos desde CSV
 * @param file Archivo CSV
 * @param headers Headers esperados (opcional)
 */
export const importFromCSV = async (
  file: File,
  headers?: string[]
): Promise<ImportResult<any>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const csv = event.target?.result as string;
        const lines = csv.split('\n').filter((line) => line.trim());

        if (lines.length < 2) {
          resolve({
            success: false,
            data: [],
            errors: ['El archivo CSV debe tener al menos un encabezado y una fila de datos'],
            rowsProcessed: 0,
          });
          return;
        }

        // Parsear encabezados
        const csvHeaders = parseCSVLine(lines[0]);

        // Validar headers si se proporcionan
        if (headers) {
          const missingHeaders = headers.filter((h) => !csvHeaders.includes(h));
          if (missingHeaders.length > 0) {
            resolve({
              success: false,
              data: [],
              errors: [`Columnas faltantes: ${missingHeaders.join(', ')}`],
              rowsProcessed: 0,
            });
            return;
          }
        }

        // Parsear filas
        const data: any[] = [];
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          try {
            const values = parseCSVLine(lines[i]);
            const row: any = {};

            csvHeaders.forEach((header, idx) => {
              row[header.trim()] = values[idx]?.trim() || '';
            });

            if (Object.values(row).some((v) => v !== '')) {
              data.push(row);
            }
          } catch (error) {
            errors.push(`Error en línea ${i + 1}: ${(error as Error).message}`);
          }
        }

        resolve({
          success: errors.length === 0,
          data,
          errors,
          rowsProcessed: lines.length - 1,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsText(file);
  });
};

/**
 * Importa datos desde JSON
 * @param file Archivo JSON
 */
export const importFromJSON = async (file: File): Promise<ImportResult<any>> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        const data = JSON.parse(json);

        if (!Array.isArray(data)) {
          resolve({
            success: false,
            data: [],
            errors: ['El archivo JSON debe contener un array de objetos'],
            rowsProcessed: 0,
          });
          return;
        }

        resolve({
          success: true,
          data,
          errors: [],
          rowsProcessed: data.length,
        });
      } catch (error) {
        resolve({
          success: false,
          data: [],
          errors: [`Error al parsear JSON: ${(error as Error).message}`],
          rowsProcessed: 0,
        });
      }
    };

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };

    reader.readAsText(file);
  });
};

/**
 * Parsea una línea de CSV considerando comillas
 * @param line Línea CSV
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Valida datos importados contra un schema
 * @param data Array de objetos
 * @param schema Definición de schema
 */
export interface Schema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'email' | 'date';
  };
}

export const validateImportData = (data: any[], schema: Schema): string[] => {
  const errors: string[] = [];

  data.forEach((row, idx) => {
    Object.keys(schema).forEach((field) => {
      const fieldDef = schema[field];
      const value = row[field];

      // Validar requerido
      if (fieldDef.required && (!value || value.toString().trim() === '')) {
        errors.push(`Línea ${idx + 2}: Campo "${field}" es requerido`);
      }

      // Validar tipo
      if (value && fieldDef.type) {
        switch (fieldDef.type) {
          case 'email':
            if (!isValidEmail(value)) {
              errors.push(`Línea ${idx + 2}: "${field}" no es un email válido`);
            }
            break;
          case 'number':
            if (isNaN(Number(value))) {
              errors.push(`Línea ${idx + 2}: "${field}" debe ser un número`);
            }
            break;
          case 'date':
            if (!isValidDate(value)) {
              errors.push(`Línea ${idx + 2}: "${field}" no es una fecha válida`);
            }
            break;
        }
      }
    });
  });

  return errors;
};

/**
 * Validadores auxiliares
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}
