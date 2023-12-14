import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import axios from "axios";
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
  const [keyForRemount, setKeyForRemount] = useState(0)

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
  }, [keyForRemount]);

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

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete("http://localhost:3000/admin/deleteUser",
      {
        params: {userId: userId}
      })
      console.log(response)
      const newUserList = users.filter((user) => {
        return user.id !== response.data.id
      })
      setUsers(newUserList);
    } catch (error) {console.log(error)}
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:3000/admin/addAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        console.log("did not work")
        throw new Error("Failed to add user");
      }

      const addedUser = await response.json();
      console.log(addedUser)
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        password: ""
        // Reset other user fields as needed
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleAddUser();
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

      <Button variant="contained" color="primary" onClick={toggleDrawer}>
        Add new user
      </Button>
      {isDrawerOpen && (
        <form className="product-form" onSubmit={(e) => handleAddUser(e)}>
          <div>
            <label>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                value={newUser.firstName}
                onChange={(e) => handleInputChange(e)}
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
                onChange={(e) => handleInputChange(e)}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Address"
                name="address"
                value={newUser.address}
                onChange={(e) => handleInputChange(e)}
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
                onChange={(e) => handleInputChange(e)}
              />
            </label>
          </div>
          <div>
            <label>
              <input
                type="text"
                placeholder="Password"
                name="password"
                value={newUser.password}
                onChange={(e) => handleInputChange(e)}
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
          >Go</Button>
 <Button
            variant="contained"
            color="primary"  onClick={() => {
              if (currentPage < totalPages) {
                handlePageChange(currentPage + 1);
              }
            }}
            style={{ color: currentPage === totalPages ? "grey" : "white" }}
          >
            Next Page
          </Button>
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

      <ul className="allProducts">
        {renderUsersForCurrentPage().map((user) => (
          <li key={user.id} className="listOfProducts product-item">
            <p>
              Name:{" "}
              <strong style={{ fontSize: "1.5em" }}>
                {user.firstName} {user.lastName}
              </strong>
            </p>
            <p>Email: {user.email} </p>
            <p>Address: {user.address} </p>
            <p>
              Admin:
              <span
                style={{
                  color: user.admin ? "green" : "red",
                  fontWeight: user.admin ? "bold" : "normal",
                }}
              >
                {user.admin ? "Yes" : "No"}
              </span>
              <Button onClick={() => deleteUser(user.id)}>
                Delete User
              </Button>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
