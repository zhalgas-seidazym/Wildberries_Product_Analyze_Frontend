import { useState, useEffect, useMemo } from "react";
import { fetchProducts } from "./api";
import type { Product, ProductFilters } from "./types";
import ProductTable from "./components/ProductTable";
import FilterPanel from "./components/FilterPanel";
import PriceHistogramChart from "./components/PriceHistogramChart";
import DiscountRatingChart from "./components/DiscountRatingChart";
import "./App.css";
import "./components/Charts.css";

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Calculate price range for filter component
  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 100000 };

    const prices = products.map(p => parseFloat(p.sale_price));
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [products]);

  // Load initial products
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (newFilters: ProductFilters = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetchProducts({
        ...newFilters,
        page_size: 300, // Get more products for better charts
      });
      setProducts(response.results);
    } catch (err) {
      setError("Ошибка при загрузке данных. Проверьте подключение к серверу.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    loadProducts(newFilters);
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);

    // Apply sorting to current products
    const sorted = [...products].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = parseFloat(a.price);
          bValue = parseFloat(b.price);
          break;
        case "sale_price":
          aValue = parseFloat(a.sale_price);
          bValue = parseFloat(b.sale_price);
          break;
        case "rating":
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case "feedbacks":
          aValue = a.feedbacks;
          bValue = b.feedbacks;
          break;
        default:
          return 0;
      }

      if (direction === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setProducts(sorted);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Анализ товаров Wildberries</h1>
        <p>Таблица товаров с фильтрами и аналитикой</p>
      </header>

      <main className="app-main">
        <FilterPanel filters={filters} onFiltersChange={handleFiltersChange} priceRange={priceRange} />

        {loading && <div className="loading">Загрузка данных...</div>}

        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <>
            <div className="charts-grid">
              <PriceHistogramChart products={products} />
              <DiscountRatingChart products={products} />
            </div>

            <div className="products-section">
              <h2>Таблица товаров ({products.length.toLocaleString()})</h2>
              <ProductTable products={products} onSort={handleSort} sortField={sortField} sortDirection={sortDirection} />
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
