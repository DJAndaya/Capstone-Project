import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail({ productId: propProductId }) {
  const { productId: routeProductId } = useParams();
  const id = propProductId || routeProductId;
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:3000/admin/allproducts/${id}`
      );
      const data = await response.json();
      setProduct(data);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch(
        `http://localhost:3000/reviews/itemReviews/${id}`
      );
      const data = await response.json();
      setReviews(data);
    };

    fetchReviews();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: ${product.price}</p>
      <p>Amount: {product.amount}</p>
      <p>Description: {product.description}</p>
      <p>Category: {product.category}</p>
      <p>Reviews:</p>
      {reviews.map((review, index) => (
        <ul key={index}>
          <li>
            <div>
              <p>Rating: {review.rating}</p>
              <p>Comment: {review.comment}</p>
            </div>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default ProductDetail;
