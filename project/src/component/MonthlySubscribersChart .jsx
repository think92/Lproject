// MonthlySubscribersChart.jsx
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const MonthlySubscribersChart = () => {
  const data = {
    labels: [
      "5월 1일",
      "5월 5일",
      "5월 10일",
      "5월 15일",
      "5월 20일",
      "5월 25일",
      "5월 30일",
    ],
    datasets: [
      {
        label: "신규 가입자 수",
        data: [65, 75, 80, 95, 100, 120, 130], // 예시 데이터
        fill: false,
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4, // 이 속성으로 선을 부드럽게 만듭니다.
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default MonthlySubscribersChart;
