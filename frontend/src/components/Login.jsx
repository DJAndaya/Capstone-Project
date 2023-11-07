import React, { useState } from "react"
import axios from "axios"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [user, setUser] = useState(null)

  useEffect(() => {
    const possiblyLogin = async () => {
      const token = window.localStorage.getItem("token")

      if (token) {
        const userResponse = await axios.get(
          "http://localhost:3000/auth/me",
          {
            headers: {
              authorization: token,
            }
          }
        )

        const user = userResponse.data
        setUser(user)
      }
    }
    
    possiblyLogin()
  }, [])

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          formData
        }
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
      setUser(user);

    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();

    loginUser(formData);
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
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
      <div>
        <div>Don't have an account?</div>
        <button>Register here</button>
      </div>
    </>
  )
}

export default Login