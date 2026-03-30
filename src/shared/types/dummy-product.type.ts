export type TDummyProductType = {
  id: number;
  title: string;
  brand: string;
  sku: string;
  thumbnail?: string;
  category: string;
  price: number;
  rating: number;
};

export type ProductSortKey = "title" | "brand" | "sku" | "price" | "rating";

export type ProductSortOrder = "asc" | "desc";
