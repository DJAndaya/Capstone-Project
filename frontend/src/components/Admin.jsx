import React from "react";
import TemporaryDrawer from "./Admin/Drawer";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectIsAuth } from "../redux/isAuthSlice";

export default function Admin() {
  const navigate = useNavigate();
  const user = useSelector(selectIsAuth);

  useEffect(() => {
    if (!user || !user.admin) {
      navigate("/login");
    }
  }, [user, navigate]);
  return (
    <div>
      <TemporaryDrawer />

      <h1>ADMIN PAGE</h1>
    </div>
  );
}
