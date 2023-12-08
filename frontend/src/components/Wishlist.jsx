import { useState, useEffect } from "react";
import axios from "axios";
// material UI imports
import {
  Box,
  Grid,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Modal,
  Select,
  MenuItem,
} from "@mui/material/";
// component imports
// import ItemCards from "./ItemCards";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";

import AddToCartButton from "./AddToCartButton";
import AddToWishlistButton from "./AddToWishListButton";
// import ReviewButton from "./ReviewButton";
import ProductDetail from "./ProductDetail";

// import socketio from "socket.io-client";

// const socket = socketio("http://localhost:3000");
// redux
// router
import { useLocation, useOutletContext } from "react-router-dom";

const Wishlist = () => {
  // const dispatch = useDispatch();
  // const user = useSelector(selectIsAuth);
  const [items, setItems] = useState(null);
  // const [allMessages, setAllMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // New state variable
  const [sortOption, setSortOption] = useState("alphabeticalAsc");

  const location = useLocation();
  const { pathname } = location;
  const [outletContext] = useOutletContext();

  const wishlist = outletContext.wishlist;
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(outletContext.shoppingCart)

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const getItems = async () => {
      // console.log("Current pathname:", pathname);

      setItems(wishlist);

      let sortedItems;
      switch (sortOption) {
        case "alphabeticalAsc":
          sortedItems = wishlist.sort((a, b) =>
            a.name > b.name ? 1 : -1
          );
          break;
        case "alphabeticalDesc":
          sortedItems = wishlist.sort((a, b) =>
            a.name < b.name ? 1 : -1
          );
          break;
        case "ratingDesc":
          sortedItems = wishlist.sort((a, b) =>
            a.averageRating < b.averageRating ? 1 : -1
          );
          break;
        case "ratingAsc":
          sortedItems = wishlist.sort((a, b) =>
            a.averageRating > b.averageRating ? 1 : -1
          );
          break;
        case "priceDesc":
          sortedItems = wishlist.sort((a, b) =>
            a.price < b.price ? 1 : -1
          );
          break;
        case "priceAsc":
          sortedItems = wishlist.sort((a, b) =>
            a.price > b.price ? 1 : -1
          );
          break;
        default:
          sortedItems = wishlist;
          break;
      }

      setItems(sortedItems);
    };

    getItems();

    // console.log(allMessages);
  }, [pathname, userId, sortOption]);

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
            <Grid item xs={12}>
              {/* Select component for sorting options */}
              <Select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                sx={{ marginBottom: 2, backgroundColor: "white" }}
              >
                <MenuItem value="alphabeticalAsc">
                  Alphabetical, A to Z
                </MenuItem>
                <MenuItem value="alphabeticalDesc">
                  Alphabetical, Z to A
                </MenuItem>
                <MenuItem value="ratingDesc">
                  Ratings, highest to lowest
                </MenuItem>
                <MenuItem value="ratingAsc">
                  Ratings, lowest to highest
                </MenuItem>
                <MenuItem value="priceDesc">Price, highest to lowest</MenuItem>
                <MenuItem value="priceAsc">Price, lowest to highest</MenuItem>
              </Select>
            </Grid>
            {items &&
              items.map((item, idx) => {
                // console.log(item.reviews)
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                    <Card>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {item.name}
                          <AddToWishlistButton item={item} />
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>
                            {item.seller[0].firstName}{" "}
                            {item.seller[0].lastName[0]}.
                          </span>
                          <span>
                            Avg. Rating: {item.averageRating.toFixed(2)}/5
                          </span>
                        </Typography>
                        <CardMedia
                          component="img"
                          image={item.images[0].imageUrl}
                          alt="item image"
                          height="200px"
                        />
                        <CardActions sx={{ justifyContent: "space-between" }}>
                          <AddToCartButton item={item} />
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              handleOpen();
                              setSelectedItem(item);
                              // console.log("item for viewDetails", selectedItem )
                            }}
                          >
                            View Details
                          </Button>
                        </CardActions>
                        <Typography variant="h6" component="div">
                          ${item.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
          </Grid>
        </Box>

        <Modal open={open} onClose={handleClose}>
          <div
            style={{
              color: "black",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflowY: "auto",
              maxHeight: "80vh",
              width: "60vw",
              position: "fixed",
              top: "10vh",
              left: "25vw",
              backgroundColor: "white",
              opacity: 0.95,
            }}
          >
            <ProductDetail selectedItem={selectedItem} />
          </div>
        </Modal>
      </Grid>
    );
  }
};

export default Wishlist;
