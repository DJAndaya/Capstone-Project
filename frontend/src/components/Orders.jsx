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
} from "@mui/material/";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// component imports
import ItemCards from "./ItemCards";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";

import AddToCartButton from "./AddToCartButton";
import ReviewButton from "./ReviewButton";
import ProductDetail from "./ProductDetail";

import socketio from "socket.io-client";

const socket = socketio("http://localhost:3000");
// redux
// router
import { useLocation, useOutletContext } from "react-router-dom";

const Orders = () => {
  // const dispatch = useDispatch();
  // const user = useSelector(selectIsAuth);
  const [items, setItems] = useState(null);
  // const [allMessages, setAllMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // New state variable

  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;
  const [outletContext] = useOutletContext();

  const wishlist = outletContext.wishlist;
  const userId = useSelector((state) => state.isAuth?.value?.id);
  // console.log(userId)
  // console.log(outletContext.shoppingCart)

  useEffect(() => {
    // console.log("before if statement occurs")
    if (!userId) {
      // console.log("if statement occured")
      navigate("/login");
    }
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (userId) {
      const getItems = async () => {
        // console.log("Current pathname:", pathname);
        try {
          const response = await axios.get(
            "http://localhost:3000/items/orderhistory",
            {
              params: { userId: userId },
            }
          );
          const alphabeticalOrderData = response.data.sort(
            (a, b) => new Date(b.dateOrdered) - new Date(a.dateOrdered)
          );
          setItems(alphabeticalOrderData);
        } catch (error) {
          console.log(error);
        }
      };

      getItems();
    }
    // console.log(allMessages);
  }, []);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate;
  };
  // Update items state when pathname is "/logout"
  // useEffect(() => {
  //   if (pathname === "/logout") {
  //     setItems(wishlist);
  //   }
  // }, [pathname, wishlist]);

  const removeFromOrderHistory = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/items/deleteOrderHistoryItem/${itemId}`);
      // After successful deletion, update the state to remove the item
      setItems((prevItems) => prevItems.filter((item) => item.item.id !== itemId));
      console.log('Item removed from order history successfully');
    } catch (error) {
      console.log(error);
      // Handle error, e.g., show a notification to the user
    }
  };  

  if (!items) {
    return <h1>loading</h1>;
  } else if (items.length === 0) {
    return <h1>No past orders</h1>;
  } else {
    // console.log(items);
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
                <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                  <Card>
                    <CardContent>
                      <Typography variant="64" component="div">
                        Date Ordered: {formatDate(item.dateOrdered)}
                        <DeleteForeverIcon onClick={() => removeFromOrderHistory(item.item.id)}/>
                      </Typography>
                      <Typography variant="h7" component="div">
                        {item.item.name}
                      </Typography>
                      {/* <CardMedia
                        component="img"
                        image={item.item.images[0].imageUrl}
                        alt="item image"
                        height="200px"
                        width="50px"
                      /> */}
                      <CardActions sx={{ justifyContent: "space-between" }}>
                        <ReviewButton item={item.item} itemId={item.id} />
                        <AddToCartButton item={item} />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleOpen();
                            setSelectedItem(item.item);
                            // console.log("item for viewDetails", selectedItem )
                          }}
                        >
                          View Details
                        </Button>
                      </CardActions>
                      <Typography variant="h6" component="div">
                        ${item.item.price}
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

export default Orders;
