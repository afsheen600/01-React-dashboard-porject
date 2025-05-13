// src/charts/GeoChart.tsx
import React from "react";
import { Chart } from "react-google-charts";

const data = [
  ["Country", "Popularity"],
  ["Germany", 200],
  ["United States", 300],
  ["Brazil", 400],
  ["Canada", 500],
  ["France", 600],
  ["Russia", 700],
];

const options = {
  colorAxis: { colors: ["#e0f7fa", "#006064"] },
  backgroundColor: "#f0f0f0",
  datalessRegionColor: "#f5f5f5",
  defaultColor: "#a5d6a7",
};

const GeoChart: React.FC = () => {
  return (
    <Chart
      chartType="GeoChart"
      width="100%"
      height="400px"
      data={data}
      options={options}
      chartEvents={[
        {
          eventName: "select",
          callback: ({ chartWrapper }) => {
            const chart = chartWrapper?.getChart?.();
            if (!chart) return;

            const selection = chart.getSelection();
            if (selection.length === 0) return;

            const region = data[selection[0].row + 1][0]; // Skip header row
            console.log("Selected region:", region);
          },
        },
      ]}
    />
  );
};

export default GeoChart;
