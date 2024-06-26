import React, { useState, useEffect, useRef } from "react";
import { Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  PointElement,
  LineElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

const MonthlySubscribersChart = ({ monthlyData }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "신규 가입자 수",
        data: [],
        borderColor: "#4CE577",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#4CE577",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#4CE577",
        tension: 0.4,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea, "#4CE577");
        },
      },
      {
        label: "프리미엄 가입자 수",
        data: [],
        borderColor: "#FE7575",
        pointBackgroundColor: "#fff",
        pointBorderColor: "#FE7575",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "#FE7575",
        tension: 0.4,
        fill: true,
        backgroundColor: function (context) {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) {
            return;
          }
          return getGradient(ctx, chartArea, "#FE7575");
        },
      },
    ],
  });

  useEffect(() => {
    if (monthlyData) {
      setChartData({
        labels: monthlyData.labels,
        datasets: [
          {
            ...chartData.datasets[0],
            data: monthlyData.regular,
          },
          {
            ...chartData.datasets[1],
            data: monthlyData.premium,
          },
        ],
      });
    }
  }, [monthlyData]);

  // Helper function to create gradient
  function getGradient(ctx, chartArea, color) {
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top
    );
    gradient.addColorStop(0, `${color}33`); // 20% opacity
    gradient.addColorStop(0.5, `${color}99`); // 60% opacity
    gradient.addColorStop(1, `${color}ff`); // 100% opacity
    return gradient;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.parsed.y}명`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: false,
          text: "날짜",
          font: {
            size: 16,
          },
        },
      },
      y: {
        title: {
          display: false,
          text: "가입자 수",
          font: {
            size: 16,
          },
        },
      },
    },
    animation: {
      duration: 2000, // 전체 애니메이션 지속 시간
      easing: "easeInOutQuart", // 시작과 끝에서 부드럽게 조절
      delay: (context) => {
        if (context.type !== "data" || context.xStarted) {
          return 0;
        }
        return context.index * 100; // 각 데이터 포인트마다 150ms의 지연을 추가하여 순차적으로 그리기
      },
      onComplete: () => {},
    },
  };

  return <Line ref={chartRef} data={chartData} options={options} />;
};

export default MonthlySubscribersChart;
