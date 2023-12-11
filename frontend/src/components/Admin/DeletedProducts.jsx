import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DeletedProducts() {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeletedProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/deletedproducts?days=5");
        if (!response.ok) {
          throw new Error("Failed to fetch deleted products");
        }
        const data = await response.json();
        setDeletedProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDeletedProducts();
  }, []);

  const handleUndoDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/restoreproduct/${productId}`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to undo delete product");
      }
      const undeletedProduct = await response.json();
      setDeletedProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== undeletedProduct.id)
      );
    } catch (error) {
      console.error("Error undoing delete product:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Deleted Products</h1>
      <ul>
        {deletedProducts.map((product) => (
          <li key={product.id}>
            <p>Product: {product.name}</p>
            <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
            <p>Amount: {product.amount} left</p>
            <p>Description: {product.description}</p>
            <p>Category: {product.category}</p>
            <button onClick={() => handleUndoDelete(product.id)}>
              Undo Delete
            </button>
            <Link to={`/product/${product.id}`}>
              <button>View Details</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}