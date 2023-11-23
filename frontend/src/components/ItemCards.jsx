import React from "react";
// material UI
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import AddToCartButton from "./AddToCartButton";
import ReviewButton from "./ReviewButton";

const ItemCards = ({ item }) => {

  const seeReviews = () => {};

  return (
    <div>
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="h7" component="div">
            Seller Name
          </Typography>
          <Typography component="div">{item.description}</Typography>
          <CardActions>
            <ReviewButton item={item} />
            <AddToCartButton item={item} />
          </CardActions>
          <Typography variant="h6" component="div">
            ${item.price}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItemCards;
