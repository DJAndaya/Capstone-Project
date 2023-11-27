import React, { useState, useEffect } from "react";
import TemporaryDrawer from "./Drawer";

const itemsPerPage = 20;

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [pageInput, setPageInput] = useState("");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/allusers");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
        calculateTotalPages(data.length);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchUsers();
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

  const renderUsersForCurrentPage = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return users.slice(startIndex, endIndex);
  };
  /********************************************************/

  const toggleDrawer = () => {
    setIsDrawerOpen((prevIsDrawerOpen) => !prevIsDrawerOpen);
  };

  return (
    <div>
      <TemporaryDrawer />
      <h1>ALL USERS</h1>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

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
