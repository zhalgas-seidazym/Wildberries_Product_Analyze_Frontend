import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Product } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface PriceHistogramChartProps {
  products: Product[];
}

const PriceHistogramChart: React.FC<PriceHistogramChartProps> = ({ products }) => {
  const chartData = useMemo(() => {
    if (products.length === 0) {
      return {
        labels: [],
        datasets: []
      };
    }

    // Get price values and find min/max
    const prices = products.map(p => parseFloat(p.sale_price));
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    // Create price ranges (bins)
    const binCount = 10;
    const binSize = (maxPrice - minPrice) / binCount;
    const bins: number[] = new Array(binCount).fill(0);
    const labels: string[] = [];

    // Create labels for price ranges
    for (let i = 0; i < binCount; i++) {
      const start = minPrice + i * binSize;
      const end = minPrice + (i + 1) * binSize;
      labels.push(`${Math.round(start)} - ${Math.round(end)} ₽`);
    }

    // Count products in each bin
    prices.forEach(price => {
      const binIndex = Math.min(Math.floor((price - minPrice) / binSize), binCount - 1);
      bins[binIndex]++;
    });

    return {
      labels,
      datasets: [
        {
          label: 'Количество товаров',
          data: bins,
          backgroundColor: 'rgba(66, 153, 225, 0.6)',
          borderColor: 'rgba(66, 153, 225, 1)',
          borderWidth: 1,
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
        text: 'Гистограмма распределения цен',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: { dataset: { label?: string }; parsed: { y: number } }) {
            return `${context.dataset.label || 'Данные'}: ${context.parsed.y} товаров`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Количество товаров'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Диапазоны цен'
        }
      }
    },
  };

  if (products.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          Нет данных для отображения гистограммы
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default PriceHistogramChart;