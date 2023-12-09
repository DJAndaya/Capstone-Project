import React, { useState, useEffect } from "react";
import "../cssFiles/Admin.css";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [pageInput, setPageInput] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [usersPerPage, setUsersPerPage] = useState(20);
  const [dropdownDisplay, setDropdownDisplay] = useState("users per page");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/allusers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    calculateTotalPages(users.length);
  }, [usersPerPage, users.length]);

  /********************************************************/
  /********* P * A * G * I * N * A * T * I * O * N ********/
  /********************************************************/

  const calculateTotalPages = (totalusers) => {
    setTotalPages(Math.ceil(totalusers / usersPerPage));
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

  const renderUsersForCurrentPage = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return users.slice(startIndex, endIndex);
  };
  /********************************************************/

  const toggleDrawer = () => {
    setIsDrawerOpen((prevIsDrawerOpen) => !prevIsDrawerOpen);
  };

  /*********************************************************/
  /* A * D * D * I * N * G *** N * E * W *** U * S * E * R */
  /*********************************************************/

  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/admin/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      const addedUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        // Reset other user fields as needed
      });
    } catch (error) {
      console.error("Error adding user:", error);
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
  /*********************************************************/
  /*********************************************************/
  /*********************************************************/

  return (
    <div>
      <h1>ALL USERS</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <button onClick={toggleDrawer}>Add new user</button>
      {isDrawerOpen && (
        <form className="product-form" onSubmit={handleFormSubmit}>
          <div>
            <label>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={newUser.firstName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                value={newUser.lastName}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <button type="submit">Add user</button>
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
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last Page
          </button>
          <select
            value={dropdownDisplay}
            onChange={(e) => {
              if (e.target.value === "All users") {
                setUsersPerPage(users.length);
                setDropdownDisplay("users per page");
              } else if (e.target.value !== "users per page") {
                setUsersPerPage(Number(e.target.value));
                setDropdownDisplay("users per page");
              }
            }}
          >
            <option value="users per page">Users per page</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="All users">All users</option>
          </select>
        </span>
      </div>

      <ul>
        {renderUsersForCurrentPage().map((user) => (
          <li key={user.id}>
            <p>First name: {user.firstName}</p>
            <p>Last name: {user.lastName}</p>
            <p>Email: {user.email} left</p>
            {/* <p>Is Admin? {user.admin}</p> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
