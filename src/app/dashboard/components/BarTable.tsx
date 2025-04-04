'use client'
import React, { useState } from 'react';
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
import GeoGrapghy from './GeoData'
import ReactTooltip from "react-tooltip";
import { useGetDatanew } from '@/hooks/useGetData';
import Cookies from 'js-cookie';


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

  const [userToken, setUserToken] = useState(Cookies.get("token"));

  const { data: analyticsInfo, isLoading: anaLoading, error, isError } = useGetDatanew(
    `/api/getanalytics/`,
    "get_analytics_details",
    userToken || " ",
  );


  if (anaLoading) {
    return <div>Loading...</div>;
  }


  console.log(analyticsInfo?.data?.infromation, "analyticsInfo");


  const data = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        data: [analyticsInfo?.data?.infromation?.male_percentage, analyticsInfo?.data?.infromation?.female_percentage],
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
        <Bar data={data} options={options} plugins={[percentageLabelsPlugin]} />
      </div>
    </div>
  );
};

const CustomerByAge = () => {
  const data = {
    labels: ['Foodstuffs', 'Phones', 'Fashion & Beauty', 'Electronics', 'Mother & Child'],
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
      <h2 className="text-lg font-semibold mb-4">Auction Product Performance <small className='text-[#344054] font-normal text-sm'>(No of bids vs categories)</small></h2>
      <div className="h-64">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

const BarChart: React.FC = () => {
  const [content, setContent] = useState("");


  const [userToken, setUserToken] = useState(Cookies.get("token"));

  const { data: analyticsInfo, isLoading: anaLoading, error, isError } = useGetDatanew(
    `/api/getanalytics/`,
    "get_analytics_details",
    userToken || " ",
  );


  if (anaLoading) {
    return <div>Loading...</div>;
  }
  console.log(analyticsInfo?.data?.infromation?.customer_by_location, "analyticsInfo");

  const datatouse = [
    { state: 'OgunState', count: 1 },
    { state: 'Edo', count: 1 },
    { state: 'Osun', count: 1 },
    { state: 'kwara', count: 3 },
    { state: 'Abia', count: 2 },
    { state: 'Adamawa', count: 2 },
    { state: 'Ekiti', count: 2 },
    { state: 'Lagos', count: 13 },
    { state: 'AkwaIbom', count: 1 },
    { state: 'Ogun', count: 3 }
  ]

  // <GeoGrapghy setTooltipContent={setContent} />
  //     <div>{content}</div>
  // <ReactTooltip>{content}</ReactTooltip>

  return (
    <div className="p-8 bg-[#F6F6F6]  flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-5xl">
        <CustomerByGender />
        <CustomerByAge />
        {/*   <MapChart setTooltipContent={setContent} /> */}



        <div>
          <GeoGrapghy
            setTooltipContent={setContent}
            customerByLocation={analyticsInfo?.data?.infromation?.customer_by_location}
          />
          <ReactTooltip>{content}</ReactTooltip>
        </div>
      </div>
    </div>
  );
};

export default BarChart;