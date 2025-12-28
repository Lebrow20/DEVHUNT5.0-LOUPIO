import { Navigate } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider";

const PrivateRoute = ({ children }) => {
  const { connecte } = useStateContext();

  return connecte ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
