// Mirrors what the API returns. Money is in naira (the API converts to/from kobo).

export type Category = "CLOTHES" | "SHOES" | "JERSEY" | "ACCESSORIES";

export interface Variant {
  id: string;
  size: string | null;
  color: string | null;
  price: number;
  minPrice: number;
  stock: number;
  reserved: number;
  available: number;
}

export interface ProductImage {
  id: string;
  color: string | null;
  position: number;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  description: string | null;
  attributes: Record<string, string | number | boolean>;
  active: boolean;
  createdAt: string;
  variants: Variant[];
  images: ProductImage[];
  mainImageId: string | null;
  totalAvailable: number;
}

export interface UploadResult {
  name: string;
  ok: boolean;
  imageId?: string;
  error?: string;
}

export interface UploadResponse {
  results: UploadResult[];
  product: Product;
}

export interface Me {
  id: string;
  businessName: string;
  email: string;
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "JERSEY", label: "Football jerseys" },
  { value: "SHOES", label: "Shoes" },
  { value: "CLOTHES", label: "Clothes" },
  { value: "ACCESSORIES", label: "Accessories" },
];
