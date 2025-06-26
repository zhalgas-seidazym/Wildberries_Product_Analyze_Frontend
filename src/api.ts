import axios from "axios";
import type { PaginatedProductList, ProductFilters } from "./types";

const API_BASE_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchProducts = async (filters: ProductFilters = {}): Promise<PaginatedProductList> => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  const response = await api.get(`/api/products?${params.toString()}`);
  return response.data;
};

export default api;
