// // src/Routes/AppRoutes.tsx
// import React, { lazy, Suspense } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { Box, CircularProgress } from "@mui/material";
// import MainLayout from "../Routes/MainLayout";
// import ProtectedRoute from "../pages/ProtectedRoute";

// const Login = lazy(() => import("../pages/Login"));
// const Dashboard = lazy(() => import("../pages/Dashboard"));
// const Analytics = lazy(() => import("../pages/Analytics"));
// const Products = lazy(() => import("../pages/Products"));
// const Settings = lazy(() => import("../pages/Settings"));
// const PageNotFound = lazy(() => import("../pages/PageNotFound"));

// const Loader = () => (
//   <Box
//     display="flex"
//     justifyContent="center"
//     alignItems="center"
//     height="100vh"
//   >
//     <CircularProgress />
//   </Box>
// );

// const AppRoutes = () => {
//   return (
//     <Box component="main">
//       <Suspense fallback={<Loader />}>
//         <Routes>
//           <Route path="/" element={<Navigate to="/login" />} />
//           <Route path="/login" element={<Login />} />

//           <Route
//             element={
//               <MainLayout>
//                 <ProtectedRoute />
//               </MainLayout>
//             }
//           >
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/analytics" element={<Analytics />} />
//             <Route path="/settings" element={<Settings />} />
//           </Route>

//           <Route path="*" element={<PageNotFound />} />
//         </Routes>
//       </Suspense>
//     </Box>
//   );
// };

// export default AppRoutes;

// src/Routes/AppRoutes.tsx
import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MainLayout from "./MainLayout";
import ProtectedRoute from "../pages/ProtectedRoute";

// Lazy-loaded pages
const Login = lazy(() => import("../pages/Login"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Analytics = lazy(() => import("../pages/Analytics"));
const Products = lazy(() => import("../pages/Products"));
const Settings = lazy(() => import("../pages/Settings"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));

// Loader component
const Loader = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
    width="100%"
    sx={{ bgcolor: "background.default" }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        height: "100%",
        px: { xs: 0, sm: 2, md: 3 },
        py: { xs: 1, sm: 2 },
        bgcolor: "background.default",
      }}
    >
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />

          <Route
            element={
              <MainLayout>
                <ProtectedRoute />
              </MainLayout>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </Box>
  );
};

export default AppRoutes;
