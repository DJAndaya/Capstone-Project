import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";

export default function Confirmation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);
  const [confirmation, setConfirmation] = useState("Confirming...");

  useEffect(() => {
    const confirmationToken = window.location.pathname.split("/").pop();
    // console.log(confirmationToken);
    const confirmEmail = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/confirm/${confirmationToken}`
        );

        if ((response.status === 200)) {
          const token = response.data;
          // console.log(token);
          window.localStorage.setItem("token", token);
          setConfirmation("Email confirmed successfully.");

          const userResponse = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/auth/loggedin`,
            {
              headers: {
                authorization: token,
              },
            }
          );

          const user = userResponse.data;
          dispatch(setIsAuth(user));
          navigate("/");
        } else {
          setConfirmation("Failed to confirm email.");
        }
      } catch (error) {
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
