import React from "react";
import { Chart } from "react-google-charts";

const data = [
  ["Year", "Sales", "Expenses"],
  ["2014", 1000, 400],
  ["2015", 1170, 460],
  ["2016", 660, 1120],
  ["2017", 1030, 540],
  ["2018", 730, 340],
  ["2019", 290, 440],
  ["2020", 250, 320],
];

// Material chart options
const options = {
  chart: {
    title: "Company Performance",
    subtitle: "Sales and Expenses over the Years",
  },
  colors: ["#003049", "0096c7"],
  bars: "horizontal",
};

function App() {
  return (
    <Chart
      // Note the usage of Bar and not BarChart for the material version
      chartType="Bar"
      width="100%"
      height="400px"
      data={data}
      options={options}
    />
  );
}

export default App;
