import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/isAuthSlice";
import { Link } from "react-router-dom";
import "../cssFiles/Admin.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import { Button, Modal, CardActions } from "@mui/material";

import DeletedProducts from "./DeletedProducts";
import ProductDetail from "../ProductDetail";

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
  const [sortOption, setSortOption] = useState("alphabeticalAsc");
  const [selectedItem, setSelectedItem] = useState(null);
  const user = useSelector(selectIsAuth);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/allproducts");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        let data = await response.json();

        data = data.filter((product) => !product.isDeleted);

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

        setProducts(sortedProducts);
        calculateTotalPages(sortedProducts.length);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sortOption]);

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
    images: ["", "", ""],
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

  const handleImageInputChange = (index, value) => {
    if (isEditFormOpen) {
      const updatedImages = [...editingProduct.images];
      updatedImages[index] = value;
      setEditingProduct({
        ...editingProduct,
        images: updatedImages,
      });
    } else {
      const updatedImages = [...newProduct.images];
      updatedImages[index] = value;
      setNewProduct({
        ...newProduct,
        images: updatedImages,
      });
    }
  };

  const handleAddProduct = async () => {
    try {
      const amountAsInt = parseInt(newProduct.amount, 10);
      const sellerId = user?.id;

      const response = await fetch("http://localhost:3000/admin/addproduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newProduct,
          amount: amountAsInt,
          sellerId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const addedProduct = await response.json();

      setProducts((prevProducts) => [...prevProducts, addedProduct]);

      setNewProduct((prevNewProduct) => ({
        ...prevNewProduct,
        name: "",
        price: "",
        amount: "",
        description: "",
        images: ["", "", ""],
        category: "",
      }));

      setProducts((prevProducts) => {
        calculateTotalPages(prevProducts.length + 1);
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
    if (!Array.isArray(productToEdit.images)) {
      productToEdit.images = ["", "", ""];
    }
    setEditingProduct(productToEdit);
    setCurrentPage(currentPage);
    setCurrentProductId(productId);
    setIsEditFormOpen(true);
  };

  const handleEditProduct = async () => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/admin/editproduct/${editingProduct.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(editingProduct),
        }
      );
      if (!response.ok) {
        console.log("did not work admin stuff")
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

      <Button variant="contained" color="primary" onClick={toggleDrawer}>
        Add New Product
      </Button>
      <Link to="/admin/deletedproducts">
        <Button variant="contained" color="primary">
          <FontAwesomeIcon icon={faTrash} /> Deleted Products
        </Button>
      </Link>

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
           <div>
            <label>
              <input
                type="text"
                name="image1"
                placeholder="First Image URL"
                value={newProduct.images[0] || ""}
                onChange={(e) => handleImageInputChange(0, e.target.value)}
                style={{ padding: "8px" }}
                // required
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                name="image2"
                placeholder="Optional Second Image URL"
                value={newProduct.images[1] || ""}
                onChange={(e) => handleImageInputChange(1, e.target.value)}
                style={{ padding: "8px" }}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                name="image3"
                placeholder="Optional Third Image URL"
                value={newProduct.images[2] || ""}
                onChange={(e) => handleImageInputChange(2, e.target.value)}
                style={{ padding: "8px" }}
              />
            </label>
          </div>
          {/* <div>
            <label>
              <input
                type="text"
                placeholder="Category"
                name="category"
                value={editingProduct.category}
                onChange={handleInputChange}
              />
            </label>
          </div> */}
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
                type="text"
                name="image1"
                placeholder="First Image URL"
                value={editingProduct.images[0] || ""}
                onChange={(e) => handleImageInputChange(0, e.target.value)}
                style={{ padding: "8px" }}
                // required
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                name="image2"
                placeholder="Optional Second Image URL"
                value={editingProduct.images[1] || ""}
                onChange={(e) => handleImageInputChange(1, e.target.value)}
                style={{ padding: "8px" }}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                name="image3"
                placeholder="Optional Third Image URL"
                value={editingProduct.images[2] || ""}
                onChange={(e) => handleImageInputChange(2, e.target.value)}
                style={{ padding: "8px" }}
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(1)}
          style={{ color: currentPage === 1 ? "grey" : "white" }}
        >
          First Page
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (currentPage > 1) {
              handlePageChange(currentPage - 1);
            }
          }}
          style={{ color: currentPage === 1 ? "grey" : "white" }}
        >
          Previous Page
        </Button>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleManualPageChange}
          >
            Go
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            style={{ color: currentPage === totalPages ? "grey" : "white" }}
          >
            Next Page
          </Button>
        </span>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handlePageChange(totalPages)}
          style={{ color: currentPage === totalPages ? "grey" : "white" }}
        >
          Last Page
        </Button>
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
            <p>
              <span className="description">Description</span>:<br />
              {product.description}
            </p>
            <p>Category: {product.category}</p>
            <div className="button-container">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleEditClick(product.id)}
              >
                Edit Product
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDeleteProduct(product.id)}
              >
                Delete Product
              </Button>
              {/* <Link to={`/product/${product.id}`}>
                <Button variant="contained" color="primary">
                  View Details
                </Button>
              </Link> */}
              <CardActions sx={{ alignItems: "left" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleOpen();
                    setSelectedItem(product);
                  }}
                >
                  View Details
                </Button>
              </CardActions>

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
                  <ProductDetail items={selectedItem} />
                </div>
              </Modal>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
