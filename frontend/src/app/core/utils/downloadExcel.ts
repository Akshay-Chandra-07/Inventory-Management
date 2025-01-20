import * as XLSX from 'xlsx';

export function downloadExcel(data: any): void {
  const rows = Object.values(data).map((product: any) => ({
    product_id: product.product_id,
    product_name: product.product_name,
    category_name: product.category_name,
    quantity: product.quantity,
    quantity_in_stock: product.quantity_in_stock,
    unit: product.unit,
    unit_price: product.unit_price,
    vendors: product.vendors
      .map((vendor: any) => vendor.vendor_name)
      .join(', '),
  }));
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, 'Products.xlsx');
}
