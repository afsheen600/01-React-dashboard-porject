// // src/App.tsx
// import React from "react";
// import { Box } from "@mui/material";
// import { BrowserRouter as Router } from "react-router-dom";
// import AppRoutes from "./Routes/AppRoutes";
// import { ThemeProvider } from "./theme/themeContext";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { setUser } from "./store/userSlice";

// const App: React.FC = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       dispatch(setUser(JSON.parse(storedUser)));
//     }
//   }, [dispatch]);

//   return (
//     <ThemeProvider>
//       <Router>
//         <Box
//           component="main"
//           sx={{
//             flexGrow: 4,
//             p: 3,
//             marginTop: "64px",
//           }}
//         >
//           <AppRoutes />
//         </Box>
//       </Router>
//     </ThemeProvider>
//   );
// };

// export default App;

// src/App.tsx
import React, { useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import { ThemeProvider } from "./theme/themeContext";
import { useDispatch } from "react-redux";
import { setUser } from "./store/userSlice";
import { useTheme } from "@mui/material/styles";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <ThemeProvider>
      <Router>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: {
              xs: 0,
              sm: 1,
              md: 3,
            },
            mt: {
              xs: 7,
              sm: 8,
            },
          }}
        >
          <AppRoutes />
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
