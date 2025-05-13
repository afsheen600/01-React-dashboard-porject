import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { Box, useTheme, useMediaQuery } from "@mui/material";

type ChartDimensions = {
  width: string;
  height: string;
};

export const data = [
  ["Task", "Hours per Day"],
  ["Work", 11],
  ["Eat", 2],
  ["Commute", 2],
  ["Watch TV", 2],
  ["Sleep", 7],
] as Array<[string, string | number]>;

export default function PieChart() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // < 600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600-900px
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900-1200px
  // const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // > 1200px

  // Calculate responsive dimensions
  const getChartDimensions = (): ChartDimensions => {
    if (isMobile) return { width: "100%", height: "250px" };
    if (isTablet) return { width: "100%", height: "300px" };
    if (isLaptop) return { width: "100%", height: "350px" };
    return { width: "100%", height: "400px" }; // Desktop
  };

  const [dimensions, setDimensions] = useState<ChartDimensions>(
    getChartDimensions()
  );

  useEffect(() => {
    const handleResize = () => setDimensions(getChartDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  const options = {
    title: "My Daily Activities",
    pieHole: 0.4,
    is3D: false,
    titleTextStyle: {
      fontSize: isMobile ? 14 : isTablet ? 15 : 16,
    },
    legend: {
      position: isMobile ? "bottom" : "right",
      alignment: "center",
      textStyle: {
        fontSize: isMobile ? 12 : 14,
      },
    },
    chartArea: {
      left: isMobile ? "10%" : "15%",
      top: isMobile ? "15%" : "20%",
      width: isMobile ? "80%" : "70%",
      height: isMobile ? "70%" : "65%",
    },
    pieSliceTextStyle: {
      fontSize: isMobile ? 12 : 14,
    },
    tooltip: {
      textStyle: {
        fontSize: isMobile ? 12 : 14,
      },
    },
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: dimensions.height,
        p: isMobile ? 0.5 : 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <Chart
        chartType="PieChart"
        width={dimensions.width}
        height={dimensions.height}
        data={data}
        options={options}
        loader={<div>Loading Chart...</div>}
      />
    </Box>
  );
}
