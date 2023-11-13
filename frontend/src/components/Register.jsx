import React, { useState } from "react"
import axios from "axios"
// redux imports
import { setIsAuth } from "../redux/isAuthSlice";
import { useDispatch } from "react-redux"

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    address: "",
  })
  const dispatch = useDispatch()


  const registerUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
          formData
      );

      const token = response.data;

      window.localStorage.setItem("token", token);

      const userResponse = await axios.get(
        "http://localhost:3000/api/auth/me",
        {
          headers: {
            authorization: token,
          },
        }
      );

      const user = userResponse.data;
      // setUser(user);
      dispatch(setIsAuth(user))
      
      } catch (error) {
        console.log(error);
      }
    };

  const onSubmit = (event) => {
    event.preventDefault();

    registerUser(formData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <>
      <h1>Registration</h1>
      <form onSubmit={onSubmit}>
        <input
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        <input
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleInputChange}
        />
        <input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleInputChange}
        />
        <input
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
        />
        <button type="submit">Register</button>
      </form>
    </>
  );
};

export default Register