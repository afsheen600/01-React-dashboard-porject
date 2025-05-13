import React from "react";
import { Chart } from "react-google-charts";
import { Box, useMediaQuery, useTheme } from "@mui/material";

// Chart data
const data = [
  ["Year", "Sales", "Expenses"],
  ["2014", 1000, 400],
  ["2015", 1170, 460],
  ["2016", 660, 1120],
  ["2017", 1030, 540],
  ["2018", 200, 400],
  ["2019", 150, 550],
  ["2020", 600, 540],
];

// Chart options
const options = {
  chart: {
    title: "Company Performance",
    subtitle: "Sales and Expenses over the Years",
  },
  colors: ["#2d4064", "#15675f"],
  responsive: true,
  chartArea: {
    width: "70%", // wider on large screens
    height: "70%",
  },
  legend: {
    position: "bottom",
  },
};

function BarChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        width: "100%",
        p: { xs: 1, sm: 2, md: 3 },
        boxShadow: 2,
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <Chart
        chartType="Bar"
        width="100%"
        height={isMobile ? "300px" : "400px"}
        data={data}
        options={{
          ...options,
          chartArea: {
            width: isMobile ? "90%" : "70%",
          },
        }}
      />
    </Box>
  );
}

export default BarChart;
