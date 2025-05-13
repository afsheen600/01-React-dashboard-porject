// src/components/MainLayout.tsx
import React from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
