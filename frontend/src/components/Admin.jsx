import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TemporaryDrawer from "./Admin/Drawer";
import AllProducts from "./Admin/AllProducts";
import AllUsers from "./Admin/AllUsers";
import "./cssFiles/Admin.css";

import { Button } from "@mui/material";

export default function Admin() {
  const [showComponent, setShowComponent] = useState("AllProducts");
  const user = useSelector((state) => state.isAuth.value);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.admin) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    document.body.classList.add("admin-page");

    return () => {
      document.body.classList.remove("admin-page");
    };
  }, []);

  return (
    <div className="admin-container">
      <div>
        {/* <TemporaryDrawer /> */}

        <h1 className="admin-header">ADMIN PAGE</h1>
        <div className="admin-description">
          Here you can view, add, edit and delete products and users to and from
          the database.
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowComponent("AllProducts")}
        >
          Show All Products
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowComponent("AllUsers")}
        >
          Show All Users
        </Button>
      </div>

      <div className="scrollable-content">
        {showComponent === "AllProducts" && <AllProducts />}
        {showComponent === "AllUsers" && <AllUsers />}
      </div>
    </div>
  );
}
