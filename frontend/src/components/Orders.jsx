import Home from "./Home";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Orders() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.isAuth?.value?.id);
  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <h1>These are the orders</h1>
      {userId ? <Home /> : null}
    </>
  );
}
