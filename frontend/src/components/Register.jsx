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

      const token = response.data;

      window.localStorage.setItem("token", token);

      const userResponse = await axios.get(
        "http://localhost:3000/auth/loggedin",
        {
          headers: {
            authorization: token,
          },
        }
      );

      const user = userResponse.data;
      dispatch(setIsAuth(user));
      navigate("/");
    } catch (error) {
      console.log(error);
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
    <>
      <h1>Registration</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          name="email"
        />
        <input
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
        />
        <input
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
          name="firstName"
        />
        <input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
          name="lastName"
        />
        <input
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          name="address"
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register;
