import React, { useState } from "react";
import axios from "axios";

import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerUser = async (formData) => {
    // console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        formData
      );

      // check email for confirmation
      navigate("/login");
    } catch (error) {
      // console.log(error);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    registerUser(formData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Registration</h1>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px", // Add spacing between inputs
        }}
      >
        <input
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          name="email"
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
          style={{ padding: "8px" }}
        />
        <input
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          name="firstName"
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          name="lastName"
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          name="address"
          style={{ padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
