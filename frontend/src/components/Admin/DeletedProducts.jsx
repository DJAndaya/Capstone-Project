import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import "../cssFiles/Admin.css";

export default function DeletedProducts() {
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("alphabeticalAsc");

  useEffect(() => {
    const fetchDeletedProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/admin/deletedproducts?days=5"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch deleted products");
        }
        const data = await response.json();

        let sortedProducts;
        switch (sortOption) {
          case "alphabeticalAsc":
            sortedProducts = data.sort((a, b) => (a.name > b.name ? 1 : -1));
            break;
          case "alphabeticalDesc":
            sortedProducts = data.sort((a, b) => (a.name < b.name ? 1 : -1));
            break;
          case "priceDesc":
            sortedProducts = data.sort((a, b) => (a.price > b.price ? 1 : -1));
            break;
          case "priceAsc":
            sortedProducts = data.sort((a, b) => (a.price < b.price ? 1 : -1));
            break;
          case "amountDesc":
            sortedProducts = data.sort((a, b) =>
              a.amount < b.amount ? 1 : -1
            );
            break;
          case "amountAsc":
            sortedProducts = data.sort((a, b) =>
              a.amount > b.amount ? 1 : -1
            );
            break;
          case "categoryDesc":
            sortedProducts = data.sort((a, b) =>
              a.category > b.category ? 1 : -1
            );
            break;
          case "categoryAsc":
            sortedProducts = data.sort((a, b) =>
              a.category < b.category ? 1 : -1
            );
            break;
          default:
            sortedProducts = data;
            break;
        }
        setDeletedProducts(sortedProducts);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDeletedProducts();
  }, [sortOption]);

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

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/deleteproducthard/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      setDeletedProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error permanently deleting product:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Deleted Products</h1>
      <Link to="/admin/">
        <Button variant="contained" color="primary">
          Back to All Products
        </Button>
      </Link>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="alphabeticalAsc">Alphabetical, A to Z</option>
        <option value="alphabeticalDesc">Alphabetical, Z to A</option>
        <option value="priceDesc">Price, highest to lowest</option>
        <option value="priceAsc">Price, lowest to highest</option>
        <option value="amountDesc">Amount, highest to lowest</option>
        <option value="amountAsc">Amount, lowest to highest</option>
        <option value="categoryDesc">Category, A to Z</option>
        <option value="categoryAsc">Category, Z to A</option>
      </select>
      <ul className="allProducts">
        {deletedProducts.map((product) => (
          <li key={product.id} className="listOfProducts product-item">
            <p className="productName">{product.name}</p>
            <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
            <p>
              Amount:{" "}
              <span
                style={{
                  color: product.amount === 0 ? "red" : "inherit",
                  fontWeight: product.amount === 0 ? "bold" : "normal",
                }}
              >
                {product.amount}
              </span>{" "}
              left
            </p>
            <p>
              <span className="description">Description:</span>{" "}
              {product.description}
            </p>
            <p>Category: {product.category}</p>
            {/* <p>Deleted on: {product.deletedAt}</p> */}
            <p>Deleted on: {new Date(product.deletedAt).toLocaleString()}</p>

            <div className="button-container">
              <Link to={`/product/${product.id}`}>
                <button>View Details</button>
              </Link>
              <button onClick={() => handleUndoDelete(product.id)}>
                Undo Delete
              </button>
              <button onClick={() => handleDelete(product.id)}>
                Delete permanently
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
