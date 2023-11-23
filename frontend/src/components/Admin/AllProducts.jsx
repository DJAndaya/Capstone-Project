import React, { useState, useEffect } from "react";
import TemporaryDrawer from "./Drawer";

const itemsPerPage = 20;

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [pageInput, setPageInput] = useState("");

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
          },
          body: JSON.stringify(editingProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit product");
      }

      // Assuming the server responds with the edited product
      const editedProduct = await response.json();

      // Update the local state to include the edited product
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

      // Reset the editing state
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
      <TemporaryDrawer />
      <h1>ALL PRODUCTS</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <h2 onClick={toggleDrawer}>
        Click here to add New Product (work in progress)
      </h2>
      {isDrawerOpen && (
        <form className="product-form" onSubmit={handleFormSubmit}>
          <div>
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
          <button type="submit">Add Product</button>
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
      </div>

      <ul>
        {renderProductsForCurrentPage().map((product) => (
          <li key={product.id}>
            <p>Product: {product.name}</p>
            <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
            <p>Amount: {product.amount} left</p>
            <p>Description: {product.description}</p>
            <p>Category: {product.category}</p>
            <button onClick={() => handleEditClick(product.id)}>
              Edit Product
            </button>
            <button onClick={() => handleDeleteProduct(product.id)}>
              Delete Product
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
