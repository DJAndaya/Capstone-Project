import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from '../redux/isAuthSlice'

export default function Confirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [confirmation, setConfirmation] = useState("Confirming...");

  useEffect(() => {
    const token = window.location.pathname.split("/").pop();

    const confirmEmail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/confirm/${token}`
        );

        if (response.ok) {
          const token = response.data;
          window.localStorage.setItem("token", token);
          setConfirmation("Email confirmed successfully.");

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
        } else {
          setConfirmation("Failed to confirm email.");
        }
      } catch (error) {
        console.error("Error confirming email:", error);
        setConfirmation("Internal Server Error.");
      }
    };

    confirmEmail();
  }, []);

  return (
    <div>
      <h1>Email Confirmation</h1>
      <p>{confirmation}</p>
    </div>
  );
}
