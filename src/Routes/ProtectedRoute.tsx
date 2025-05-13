// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "../firebase-config";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         navigate("/login");
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   return <>{children}</>;
// };

// export default ProtectedRoute;

// src/pages/ProtectedRoute.tsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase-config";
import { Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return authenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
