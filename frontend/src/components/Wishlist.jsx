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

import ShoppingCartButton from "./ShoppingCartButton";
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
  const [outletContext, setOutletContext] = useOutletContext();

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

  useEffect(() => {
    if (userId && wishlist.length === 0) {
      const getUserWishlistData = async () => {
        const response = await axios.get(
          "http://localhost:3000/items/wishlist",
          {
            params: { userId },
          }
        );
        const userWishlist = response.data;
        // console.log(userWishlist)
        setOutletContext({
          ...outletContext,
          wishlist: userWishlist,
        });
      };
      getUserWishlistData();
    }
  }, [])

  if (wishlist.length === 0 || !wishlist) {
    return <h1>Wishlist is empty</h1>;
  } else {
    // console.log(outletContext);
    return (
      <Grid container style={{ marginBottom: "500px" }}>
        <ShoppingCartButton />
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={2}
            // alignItems="center"
            // justifyContent="center"
          >
            <Grid item xs={12}>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                E-commerce
              </Typography>
              {/* Select component for sorting options */}
              <Typography sx={{ textAlign: "right" }}>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  sx={{ backgroundColor: "white" }}
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
                  <MenuItem value="priceDesc">
                    Price, highest to lowest
                  </MenuItem>
                  <MenuItem value="priceAsc">Price, lowest to highest</MenuItem>
                </Select>
              </Typography>
            </Grid>
            {items &&
              items.map((item, idx) => {
                // console.log(item.reviews)
                return (
                  <Grid item xs={12} sm={6} md={4} lg={4} key={idx}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span style={{ float: "left" }}>{item.name}</span>
                          <AddToWishlistButton
                            item={item}
                            sx={{
                              float: "right",
                              // marginRight: "10px",
                            }}
                          />
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
                            {item.seller && item.seller[0]
                              ? `${item.seller[0].firstName} ${item.seller[0].lastName[0]}.`
                              : ""}
                          </span>
                          <span>

                            {item.averageRating
                              ? `Avg. Rating: ${item.averageRating.toFixed(
                                  2
                                )}/5`
                              : "No reviews"}
                          </span>
                        </Typography>
                        <CardMedia
                          component="img"
                          image={
                            item.images && item.images[0]
                              ? item.images[0].imageUrl
                              : "defaultImage.jpg"
                          }
                          alt="item image"
                          height="200px"
                          style={{objectFit: "contain"}}
                        />
                        <CardActions sx={{ alignItems: "left" }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                              handleOpen();
                              setSelectedItem(item);
                            }}
                          >
                            View Details
                          </Button>
                        </CardActions>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <span>${item.price}</span>
                          <AddToCartButton item={item} />
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
              // alignItems: "center",
              // justifyContent: "center",
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
