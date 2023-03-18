import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const GuestRoutes = ({ children }) => {
    const { isAuth } = useSelector((state) => state.auth);
    return isAuth ? <Navigate to={"/rooms"} replace /> : children;
  };
  
  export const SemiProtectedRoutes = ({ children }) => {
    const { isAuth, user } = useSelector((state) => state.auth);
    return !isAuth ? (
      <Navigate to={"/"} replace />
    ) : isAuth && !user.activated ? (
      children
    ) : (
      <Navigate to={"/rooms"} replace />
    );
  };
  
  export const ProtectedRoutes = ({ children }) => {
    const { isAuth, user } = useSelector((state) => state.auth);
    return !isAuth ? (
      <Navigate to={"/"} replace />
    ) : isAuth && !user.activated ? (
      <Navigate to={"/activate"} replace />
    ) : (
      children
    );
  };
  