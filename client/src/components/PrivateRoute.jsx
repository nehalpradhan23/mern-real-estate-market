import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  // goto child component using outlet
  return currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />;
}
