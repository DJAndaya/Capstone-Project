import React, { useState, useEffect } from "react";
import TemporaryDrawer from "./Drawer";

const itemsPerPage = 20;

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/allproducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
        calculateTotalPages(data.length);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /********************************************************/
  /********* P * A * G * I * N * A * T * I * O * N ********/
  /********************************************************/

  const calculateTotalPages = (totalItems) => {
    setTotalPages(Math.ceil(totalItems / itemsPerPage));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleManualPageChange = () => {
    const pageNumber = parseInt(pageInput, 10);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setPageInput("");
    }
  };

  const renderProductsForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };
  /********************************************************/

  /********************************************************/
  /******* A * D * M * I * N *** S * T * U * F * F ********/
  /********************************************************/

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // Assuming the server responds with the added product
      const addedProduct = await response.json();

      // Update the local state to include the new product
      setProducts((prevProducts) => [...prevProducts, addedProduct]);

      // Reset the new product form
      setNewProduct({
        name: "",
        price: "",
        description: "",
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  /********************************************************/

  return (
    <div>
      <TemporaryDrawer />
      <h1>ALL PRODUCTS</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <h2>Add New Product (dummy)</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={newProduct.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Price:
          <input
            type="text"
            name="price"
            value={newProduct.price}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description:
          <input
            type="text"
            name="description"
            value={newProduct.description}
            onChange={handleInputChange}
          />
        </label>
        <button type="button" onClick={handleAddProduct}>
          Add Product
        </button>
      </form>
      <ul>
        {renderProductsForCurrentPage().map((product) => (
          <li key={product.id}>
            <p>Product: {product.name}</p>
            <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
            <p>Description: {product.description}</p>
          </li>
        ))}
      </ul>

      <div>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span>
          Go to Page:{" "}
          <input
            type="number"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            min="1"
            max={totalPages}
          />
          <button onClick={handleManualPageChange}>Go</button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next Page
          </button>
        </span>
      </div>
     
    </div>
  );
}
