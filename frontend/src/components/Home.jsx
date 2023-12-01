import React, { useState, useEffect } from "react";
import axios from "axios";
// material UI imports
import { Box, Grid } from "@mui/material/";
// component imports
import ItemCards from "./ItemCards";
// redux
import { useSelector } from "react-redux";
// router
import { useLocation, useOutletContext } from "react-router-dom";

const Home = () => {
  const [items, setItems] = useState(null);

  const location = useLocation();
  const { pathname } = location;
  const [outletContext] = useOutletContext();
  const wishList = outletContext.wishList
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(outletContext.shoppingCart)

  useEffect(() => {
    const getItems = async () => {
      // console.log("Current pathname:", pathname);
      try {
        let response;
        if (pathname === "/user/orders") {
          response = await axios.get(
            "http://localhost:3000/items/orderhistory",
            {
              params: { userId: userId },
            }
          );
          const alphabeticalOrderData = response.data.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        setItems(alphabeticalOrderData);
        } else if (pathname === "/logout") {
          
            setItems(wishList);
          
        } else {
          response = await axios.get("http://localhost:3000/items/");
          const alphabeticalOrderData = response.data.sort((a, b) =>
          a.name > b.name ? 1 : -1
        );
        setItems(alphabeticalOrderData);
        }

        // const alphabeticalOrderData = response.data.sort((a, b) =>
        //   a.name > b.name ? 1 : -1
        // );
        // setItems(alphabeticalOrderData);
      } catch (error) {
        console.log(error);
      }
    };

    getItems();
  }, [pathname, userId]);

  // Update items state when pathname is "/logout"
  // useEffect(() => {
  //   if (pathname === "/logout") {
  //     setItems(wishList);
  //   }
  // }, [pathname, wishList]);

  if (!items) {
    return <h1>loading</h1>;
  }
  return (
    <Grid container>
      <Box sx={{ flexGrow: 1 }}>
        <Grid
          container
          spacing={{ xs: 1, md: 1 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {items.map((item, idx) => {
            return (
              <Grid item xs={2} sm={2} md={2} key={idx}>
                <ItemCards item={item} />
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};

export default Home;
