import React, { useState, useEffect } from "react";
import axios from "axios";
// material UI imports
import { Box, Grid } from "@mui/material/";
// component imports
import ItemCards from "./ItemCards";

const Home = () => {
  const [items, setItems] = useState(null);

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/items/a");

        // console.log(response.data);
        const alphabeticalOrderData = response.data.sort((a, b) => {
          return a.name > b.name ? 1 : -1;
        });
        // console.log(alphabeticalOrderData);
        setItems(alphabeticalOrderData);
      } catch (error) {
        console.log(error);
      }
    };
    getItems();
  }, []);

  if (!items) {
    return <h1>loading</h1>;
  } else {
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
  }
};

export default Home;
