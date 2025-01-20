import * as xlsx from 'xlsx';

export function importFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target) {
        try {
          const data = event.target.result as ArrayBuffer;
          const workbook = xlsx.read(data, { type: 'buffer' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const tableData = xlsx.utils.sheet_to_json(worksheet);
          resolve(tableData);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error('No File Found'));
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsArrayBuffer(file);
  });
}
