export interface Product {
  product_id: number;
  product_name: string;
  product_image: string | null;
  unit: string;
  unit_price?: number
  quantity_in_stock: number;
  category_name: string;
  vendors: Vendor[];
  quantity?: number;
  selectedVendor?: string;
  selected?: boolean;
}

export interface Vendor {
  vendor_id: number;
  vendor_name: string;
}
