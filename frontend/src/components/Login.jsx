import React, { useState, useEffect } from "react";
import axios from "axios";

import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch } from "react-redux";

import { NavLink, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const possiblyLogin = async () => {
      const token = window.localStorage.getItem("token");

      if (token) {
        const userResponse = await axios.get("http://localhost:3000/auth/me", {
          headers: {
            authorization: token,
          },
        });

        const user = userResponse.data;
        dispatch(setIsAuth(user));
      }
    };

    possiblyLogin();
  }, []);

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
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
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    loginUser(formData);
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
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
      <div>
        <div>Don't have an account?</div>
        <NavLink
          to={"/register"}
          className={({ isActive, isPending }) =>
            isActive ? "active" : isPending ? "pending" : "text-white mr-4"
          }
        >
          <button>Register here</button>
        </NavLink>
        <br />
      </div>
    </>
  );
};

export default Login;
