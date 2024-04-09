export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  stock: number;
  pricePurchase: number;
  priceSale: number;
  updatedAt: string;
}

export interface ProductEdit {
  stock?: number;
  pricePurchase?: number;
  priceSale?: number;
}
