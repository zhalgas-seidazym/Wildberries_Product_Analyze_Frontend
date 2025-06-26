export interface Product {
  product_id: number;
  name: string;
  price: string;
  sale_price: string;
  rating: number | null;
  feedbacks: number;
}

export interface PaginatedProductList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductFilters {
  query?: string;
  min_price?: number;
  max_price?: number;
  min_sale_price?: number;
  max_sale_price?: number;
  min_rating?: number;
  min_reviews?: number;
  ordering?: string;
  page?: number;
  page_size?: number;
}