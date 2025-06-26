import React, { useState, useEffect } from 'react';
import type { ProductFilters } from '../types';
import './FilterPanel.css';

interface FilterPanelProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  priceRange: { min: number; max: number };
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  priceRange,
}) => {
  const [localFilters, setLocalFilters] = useState<ProductFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field: keyof ProductFilters, value: string) => {
    if (field === 'query') {
      const newFilters = { ...localFilters, [field]: value === '' ? undefined : value };
      setLocalFilters(newFilters);
    } else {
      const numValue = value === '' ? undefined : parseFloat(value);
      const newFilters = { ...localFilters, [field]: numValue };
      setLocalFilters(newFilters);
    }
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters: ProductFilters = {};
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <div className="filter-panel">
      <h3>Фильтры</h3>
      
      <div className="filter-group">
        <label>Поиск по названию</label>
        <input
          type="text"
          placeholder="Введите название товара..."
          value={localFilters.query || ''}
          onChange={(e) => handleInputChange('query', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Диапазон цен (₽)</label>
        <div className="price-range">
          <input
            type="number"
            placeholder={`Мин. ${priceRange.min}`}
            value={localFilters.min_price || ''}
            onChange={(e) => handleInputChange('min_price', e.target.value)}
            className="price-input"
          />
          <span>—</span>
          <input
            type="number"
            placeholder={`Макс. ${priceRange.max}`}
            value={localFilters.max_price || ''}
            onChange={(e) => handleInputChange('max_price', e.target.value)}
            className="price-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Диапазон цен со скидкой (₽)</label>
        <div className="price-range">
          <input
            type="number"
            placeholder="Мин."
            value={localFilters.min_sale_price || ''}
            onChange={(e) => handleInputChange('min_sale_price', e.target.value)}
            className="price-input"
          />
          <span>—</span>
          <input
            type="number"
            placeholder="Макс."
            value={localFilters.max_sale_price || ''}
            onChange={(e) => handleInputChange('max_sale_price', e.target.value)}
            className="price-input"
          />
        </div>
      </div>

      <div className="filter-group">
        <label>Минимальный рейтинг</label>
        <input
          type="number"
          min="0"
          max="5"
          step="0.1"
          placeholder="4.0"
          value={localFilters.min_rating || ''}
          onChange={(e) => handleInputChange('min_rating', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-group">
        <label>Минимальное количество отзывов</label>
        <input
          type="number"
          min="0"
          placeholder="100"
          value={localFilters.min_reviews || ''}
          onChange={(e) => handleInputChange('min_reviews', e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-actions">
        <button onClick={handleApply} className="apply-btn">
          Применить
        </button>
        <button onClick={handleReset} className="reset-btn">
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;