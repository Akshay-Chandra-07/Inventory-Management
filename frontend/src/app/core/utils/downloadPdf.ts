import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function generatePdf(data: any) {
  const doc: any = new jsPDF();
  console.log(data);
  let vendors: any = [];
  data.vendors.forEach((vendor: any) => {
    vendors.push(vendor.vendor_name);
  });
  doc.text(`Product details`, 10, 20);
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 255);
  autoTable(doc, {
    head: [
      [
        'Product name',
        'category',
        'vendors',
        'quantity',
        'unit',
        'unit_price',
        'image_url',
      ],
    ],
    body: [
      [
        data.product_name,
        data.category_name,
        vendors,
        data.quantity_in_stock,
        data.unit,
        data.unit_price,
        data.product_image,
      ],
    ],
    startY: 40,
  });

  doc.save(`${data.product_name}_${data.product_id}`);
}
