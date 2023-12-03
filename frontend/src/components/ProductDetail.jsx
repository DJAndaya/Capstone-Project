import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:3000/admin/allproducts/${productId}`
      );
      const data = await response.json();
      setProduct(data);
    };

    fetchProduct();
  }, [productId]);

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
    </div>
  );
}

export default ProductDetail;
