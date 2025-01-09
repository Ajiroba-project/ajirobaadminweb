import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';




// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


// Custom plugin to draw percentage labels
interface PercentageLabelsPlugin {
    id: string;
    afterDatasetsDraw: (chart: ChartJS) => void;
}

const percentageLabelsPlugin: PercentageLabelsPlugin = {
    id: 'percentageLabels',
    afterDatasetsDraw: (chart: ChartJS) => {
        const { ctx, data } = chart;
        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
                const value = dataset.data[index] as number;
                const label = `${value}%`;
                const x = bar.x;
                const y = bar.y + 20; // Adjust the y position as needed
                ctx.fillStyle = '#344054';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(label, x, y);
            });
        });
    },
};


const CustomerByGender = () => {
  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#F25E26', '#F25E26'],
        barPercentage: 0.8,
         barThickness: 10,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
            percentageLabels: {},
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { display: false, font: { size: 10 } },
        grid: { display: false },
      },
      y: {
        ticks: { color: '#344054', font: { size: 10 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Customer by Gender</h2>
      <div className="h-32">
        <Bar data={data} options={options}  plugins={[percentageLabelsPlugin]} />
      </div>
    </div>
  );
};

const CustomerByAge = () => {
  const data = {
    labels: ['18 - 30', '31 - 40', '41 - 50', '51 - 60', '61 and Above'],
    datasets: [
      {
        data: [3500, 2500, 2000, 1000, 500],
        backgroundColor: '#F25E26',
         barThickness: 10,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: '#344054' },
        grid: { display: false },

      },
      y: {
        ticks: { color: '#344054' },
        grid: { display: true, color: '#E5E5E5' },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Customer by Age</h2>
      <div className="h-64">
        <Bar data={data} options={options}  />
      </div>
    </div>
  );
};

const BarChart = () => {
  return (
    <div className="p-8 bg-[#F6F6F6]  flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <CustomerByGender />
        <CustomerByAge />
      </div>
    </div>
  );
};

export default BarChart;