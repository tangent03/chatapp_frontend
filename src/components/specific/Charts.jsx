import {
    ArcElement,
    CategoryScale,
    Chart as ChartJS,
    Filler,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Tooltip,
} from "chart.js";
import React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import {
    darkTextSecondary,
    lightBlue,
    orange
} from "../../constants/color";
import { getLast7Days } from "../../lib/features";

ChartJS.register(
  Tooltip,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler,
  ArcElement,
  Legend
);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: '#fff',
      bodyColor: '#fff',
      bodyFont: {
        family: "'Poppins', sans-serif",
      },
      titleFont: {
        family: "'Poppins', sans-serif",
      },
    },
  },

  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: darkTextSecondary,
        font: {
          family: "'Poppins', sans-serif",
        },
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
      ticks: {
        color: darkTextSecondary,
        font: {
          family: "'Poppins', sans-serif",
        },
      }
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Messages",
        fill: true,
        backgroundColor: `${lightBlue}20`,
        borderColor: lightBlue,
        tension: 0.4,
        pointBackgroundColor: lightBlue,
        pointBorderColor: lightBlue,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  return <Line data={data} options={lineChartOptions} />;
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      titleColor: '#fff',
      bodyColor: '#fff',
      bodyFont: {
        family: "'Poppins', sans-serif",
      },
      titleFont: {
        family: "'Poppins', sans-serif",
      },
    },
  },
  cutout: 120,
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [`${lightBlue}30`, `${orange}30`],
        hoverBackgroundColor: [`${lightBlue}80`, `${orange}80`],
        borderColor: [lightBlue, orange],
        offset: 40,
      },
    ],
  };
  return (
    <Doughnut
      style={{ zIndex: 10 }}
      data={data}
      options={doughnutChartOptions}
    />
  );
};

export { DoughnutChart, LineChart };
