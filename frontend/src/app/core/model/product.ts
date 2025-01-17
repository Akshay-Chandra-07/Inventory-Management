export interface Product {
  product_id: number;
  product_name: string;
  product_image: string | null;
  unit: string;
  quantity_in_stock: number;
  category_name: string;
  vendors: Vendor[];
  quantity?: number;
}

export interface Vendor {
  vendor_id: number;
  vendor_name: string;
}
