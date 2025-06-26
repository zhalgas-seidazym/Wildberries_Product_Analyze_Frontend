import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import type { Product } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DiscountRatingChartProps {
  products: Product[];
}

const DiscountRatingChart: React.FC<DiscountRatingChartProps> = ({ products }) => {
  const chartData = useMemo(() => {
    if (products.length === 0) {
      return {
        datasets: []
      };
    }

    // Calculate discount and filter products with valid ratings
    const dataPoints = products
      .filter(product => product.rating !== null && product.rating > 0)
      .map(product => {
        const originalPrice = parseFloat(product.price);
        const salePrice = parseFloat(product.sale_price);
        const discount = originalPrice === salePrice ? 0 : 
          Math.round(((originalPrice - salePrice) / originalPrice) * 100);
        
        return {
          x: product.rating,
          y: discount,
          productName: product.name,
          price: originalPrice,
          salePrice: salePrice
        };
      })
      .filter(point => point.x !== null);

    return {
      datasets: [
        {
          label: 'Размер скидки vs Рейтинг',
          data: dataPoints,
          backgroundColor: 'rgba(229, 62, 62, 0.6)',
          borderColor: 'rgba(229, 62, 62, 1)',
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  }, [products]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Зависимость размера скидки от рейтинга товара',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          title: function() {
            return '';
          },
          label: function(context: { raw: unknown }) {
            const point = context.raw as { productName: string; x: number; y: number; price: number; salePrice: number };
            return [
              `Товар: ${point.productName.substring(0, 50)}...`,
              `Рейтинг: ${point.x}`,
              `Скидка: ${point.y}%`,
              `Цена: ${point.price.toLocaleString()} ₽`,
              `Цена со скидкой: ${point.salePrice.toLocaleString()} ₽`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear' as const,
        position: 'bottom' as const,
        title: {
          display: true,
          text: 'Рейтинг товара'
        },
        min: 0,
        max: 5,
      },
      y: {
        title: {
          display: true,
          text: 'Размер скидки (%)'
        },
        min: 0,
      }
    },
  };

  if (products.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          Нет данных для отображения графика
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default DiscountRatingChart;