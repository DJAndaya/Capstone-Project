import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../cssFiles/Admin.css";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [pageInput, setPageInput] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [dropdownDisplay, setDropdownDisplay] = useState("Items per page");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
  useEffect(() => {
    calculateTotalPages(products.length);
  }, [products, itemsPerPage]);
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
    amount: "",
    description: "",
    category: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (isEditFormOpen) {
      setEditingProduct((prevEditingProduct) => ({
        ...prevEditingProduct,
        [name]: value,
      }));
    } else {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value,
      }));
    }
  };

  const handleAddProduct = async () => {
    try {
      const amountAsInt = parseInt(newProduct.amount, 10);

      const response = await fetch("http://localhost:3000/admin/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          amount: amountAsInt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      // Assuming the server responds with the added product
      const addedProduct = await response.json();

      // Update the local state to include the new product
      setProducts((prevProducts) => [...prevProducts, addedProduct]);

      // Use the functional form of setState to ensure the latest state
      setNewProduct((prevNewProduct) => ({
        ...prevNewProduct,
        name: "",
        price: "",
        amount: "",
        description: "",
        category: "",
      }));

      // Use the functional form of setState to ensure the latest state
      setProducts((prevProducts) => {
        calculateTotalPages(prevProducts.length + 1); // +1 for the newly added product
        return prevProducts;
      });
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleAddProduct();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  /********************************************************/
  /********************************************************/
  /* D * E * L * E * T * E *** P * R * O * D * U * C * T **/
  /********************************************************/
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/deleteproduct/${productId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      // Filter out the deleted product from the local state
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };
  /********************************************************/
  /********************************************************/
  /***** E * D * I * T *** P * R * O * D * U * C * T ******/
  /********************************************************/
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const handleEditClick = (productId) => {
    const productToEdit = products.find((product) => product.id === productId);
    setEditingProduct(productToEdit);
    setCurrentPage(currentPage);
    setCurrentProductId(productId);
    setIsEditFormOpen(true);
  };
  const handleEditProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin/editproduct/${editingProduct.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingProduct),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to edit product");
      }
      const editedProduct = await response.json();
      setProducts((prevProducts) => {
        const index = prevProducts.findIndex(
          (product) => product.id === editedProduct.id
        );
        if (index !== -1) {
          const updatedProducts = [...prevProducts];
          updatedProducts[index] = editedProduct;
          return updatedProducts;
        }
        return prevProducts;
      });
      setEditingProduct(null);
      setIsEditFormOpen(false);
    } catch (error) {
      console.error("Error editing product:", error);
    }
  };

  /********************************************************/

  const toggleDrawer = () => {
    setIsDrawerOpen((prevIsDrawerOpen) => !prevIsDrawerOpen);
  };

  return (
    <div>
      <h1>ALL PRODUCTS</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <button onClick={toggleDrawer}>Add new product</button>
      {isDrawerOpen && (
        <form className="product-form" onSubmit={handleFormSubmit}>
          <div className="inputFieldContainer">
            <label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={newProduct.name}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="decimal"
                placeholder="Price"
                name="price"
                value={newProduct.price}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="integer"
                placeholder="Amount"
                name="amount"
                value={newProduct.amount}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Category"
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button type="submit">Add New Product</button>
        </form>
      )}
      {isEditFormOpen && (
        <form className="product-form" onSubmit={handleEditProduct}>
          <div>
            <label>
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={editingProduct.name}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="decimal"
                placeholder="Price"
                name="price"
                value={editingProduct.price}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="integer"
                placeholder="Amount"
                name="amount"
                value={editingProduct.amount}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={editingProduct.description}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="integer"
                placeholder="Amount"
                name="amount"
                value={editingProduct.amount}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Description"
                name="description"
                value={editingProduct.description}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Category"
                name="category"
                value={editingProduct.category}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button type="submit">Update Product</button>
          <button onClick={() => setIsEditFormOpen(false)}>Cancel</button>
        </form>
      )}
      <div>
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          First Page
        </button>
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleManualPageChange();
              }
            }}
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
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          Last Page
        </button>
        <select
          value={dropdownDisplay}
          onChange={(e) => {
            if (e.target.value === "All products") {
              setItemsPerPage(products.length);
              setDropdownDisplay("Items per page");
            } else if (e.target.value !== "Items per page") {
              setItemsPerPage(Number(e.target.value));
              setDropdownDisplay("Items per page");
            }
          }}
        >
          <option value="Items per page">Items per page</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="All products">All products</option>
        </select>
      </div>
      <ul className="allProducts">
        {renderProductsForCurrentPage().map((product) => (
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
            <style jsx>{`
              .description {
                text-decoration: underline;
              }
            `}</style>
            <p>
              <span className="description">Description</span>:<br />
              {product.description}
            </p>
            <p>Category: {product.category}</p>
            <div className="button-container">
              <button onClick={() => handleEditClick(product.id)}>
                Edit Product
              </button>
              <button onClick={() => handleDeleteProduct(product.id)}>
                Delete Product
              </button>
              <Link to={`/product/${product.id}`}>
                <button>View Details</button>
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
