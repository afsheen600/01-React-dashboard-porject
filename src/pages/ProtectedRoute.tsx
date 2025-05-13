import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import Loading from "../pages/Loading";

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
