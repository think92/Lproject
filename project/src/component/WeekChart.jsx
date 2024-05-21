import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// 데이터 레이블 플러그인 정의
const dataLabelPlugin = {
  id: "dataLabelPlugin",
  afterDatasetDraw: (chart, args) => {
    const { ctx } = chart;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#444";

    const dataset = chart.data.datasets[args.index];
    const scaleFactor = chart.scales.y.max * 0.95; // 상단 5% 여유 공간 확보
    dataset.data.forEach((value, index) => {
      const meta = chart.getDatasetMeta(args.index);
      const bar = meta.data[index];
      const yPos = value >= scaleFactor ? bar.y + 20 : bar.y - 5; // 값에 따라 레이블 위치 조정
      ctx.fillText(value, bar.x, yPos);
    });
  },
};

// 플러그인을 Chart.js 시스템에 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  dataLabelPlugin // 여기에 플러그인 추가
);

// 공통 옵션 설정
const baseOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      display: true,
      grid: {
        drawBorder: false,
        display: false,
      },
    },
    y: {
      display: true,
      suggestedMax: 10, // 데이터 최대값에 따라 조정 필요
      beginAtZero: true,
    },
  },
  elements: {
    bar: {
      borderRadius: 20,
    },
  },
};

// 그라디언트 적용 함수
function applyGradient(chart, colorStart, colorEnd) {
  const ctx = chart.ctx;
  const chartArea = chart.chartArea;
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  );
  gradient.addColorStop(0, colorEnd);
  gradient.addColorStop(1, colorStart);
  return gradient;
}

// 옵션 설정 및 플러그인 추가
const regularOptions = {
  ...baseOptions,
  plugins: {
    ...baseOptions.plugins,
    dataLabelPlugin, // 플러그인 추가
  },
  animation: {
    onComplete: (animation) => {
      const chart = animation.chart;
      chart.data.datasets[0].backgroundColor = applyGradient(
        chart,
        "#A7EAC6",
        "#B2E2BF"
      ); // 연한 녹색 그라디언트
      chart.update();
    },
  },
};

const premiumOptions = {
  ...baseOptions,
  plugins: {
    ...baseOptions.plugins,
    dataLabelPlugin, // 플러그인 추가
  },
  animation: {
    onComplete: (animation) => {
      const chart = animation.chart;
      chart.data.datasets[0].backgroundColor = applyGradient(
        chart,
        "#FFA1A1",
        "#FFC1C1"
      ); // 연한 붉은색 그라디언트
      chart.update();
    },
  },
};

// 컴포넌트 정의
const RegularSignupChart = ({ data }) => (
  <Bar data={data} options={regularOptions} />
);
const PremiumSignupChart = ({ data }) => (
  <Bar data={data} options={premiumOptions} />
);

// 차트 데이터
const regularData = {
  labels: ["월", "화", "수", "목", "금", "토", "일"],
  datasets: [
    {
      label: "신규 가입자 수",
      data: [5, 9, 3, 1, 3, 7, 4],
    },
  ],
};

const premiumData = {
  labels: ["월", "화", "수", "목", "금", "토", "일"],
  datasets: [
    {
      label: "프리미엄 가입자 수",
      data: [3, 10, 3, 1, 1, 1, 12],
    },
  ],
};

export { RegularSignupChart, PremiumSignupChart };
