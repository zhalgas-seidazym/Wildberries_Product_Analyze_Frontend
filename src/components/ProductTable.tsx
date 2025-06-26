import React from 'react';
import type { Product } from '../types';
import './ProductTable.css';

interface ProductTableProps {
  products: Product[];
  onSort: (field: string, direction: 'asc' | 'desc') => void;
  sortField: string | null;
  sortDirection: 'asc' | 'desc';
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onSort,
  sortField,
  sortDirection,
}) => {
  const handleSort = (field: string) => {
    const newDirection = 
      sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(field, newDirection);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatPrice = (price: string) => {
    return `${parseFloat(price).toLocaleString()} ₽`;
  };

  const calculateDiscount = (price: string, salePrice: string) => {
    const originalPrice = parseFloat(price);
    const discountedPrice = parseFloat(salePrice);
    if (originalPrice === discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  return (
    <div className="product-table-container">
      <table className="product-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="sortable">
              Название товара {getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('price')} className="sortable">
              Цена {getSortIcon('price')}
            </th>
            <th onClick={() => handleSort('sale_price')} className="sortable">
              Цена со скидкой {getSortIcon('sale_price')}
            </th>
            <th>Скидка</th>
            <th onClick={() => handleSort('rating')} className="sortable">
              Рейтинг {getSortIcon('rating')}
            </th>
            <th onClick={() => handleSort('feedbacks')} className="sortable">
              Количество отзывов {getSortIcon('feedbacks')}
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.product_id}>
              <td className="product-name">{product.name}</td>
              <td className="price">{formatPrice(product.price)}</td>
              <td className="price">{formatPrice(product.sale_price)}</td>
              <td className="discount">
                {calculateDiscount(product.price, product.sale_price)}%
              </td>
              <td className="rating">
                {product.rating ? product.rating.toFixed(1) : 'N/A'}
              </td>
              <td className="feedbacks">{product.feedbacks.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="no-products">Товары не найдены</div>
      )}
    </div>
  );
};

export default ProductTable;