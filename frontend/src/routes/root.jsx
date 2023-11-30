import { Outlet, Link } from "react-router-dom";
import { useState } from "react";

import { Box, AppBar, Toolbar, InputBase } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import { setIsAuth, selectIsAuth } from "../redux/isAuthSlice";
import { useDispatch, useSelector } from "react-redux";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
  flexGrow: 1,
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function Root() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  // const [shoppingCart, setShoppingCart] = useState([])
  // const [wishList, setWishList] = useState([])
  const [outletContext, setOutletContext] = useState({
    shoppingCart: [],
    wishList: [],
  })

  const handleSearch = () => {
    if (searchQuery.trim() != "") {
      setSearchQuery("");
      navigate(`/results/${searchQuery}`);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div>
      <Box marginBottom={10}>
        <AppBar>
          <Toolbar>
            <Box sx={{ marginLeft: 5, marginRight: 5 }}>
              <Link style={{ textDecoration: "none", color: "white" }} to="/">
                Home
              </Link>
            </Box>
            <Search>
              <SearchIconWrapper onClick={handleSearch}>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </Search>
            <Box sx={{ marginLeft: 5, marginRight: 5 }}>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="user/cart"
              >
                Cart
              </Link>
            </Box>
            <Box sx={{ marginLeft: 5, marginRight: 5 }}>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="user/orders"
              >
                Orders
              </Link>
            </Box>
            <Box sx={{ marginLeft: 5, marginRight: 5 }}>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="user/sell"
              >
                Sell
              </Link>
            </Box>
            <Box sx={{ marginLeft: 5, marginRight: 5 }}>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="user/chat"
              >
                Chat
              </Link>
            </Box>
            {isAuth && isAuth.admin ? (
              <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="admin"
                >
                  Admin
                </Link>
              </Box>
            ) : null}
            {isAuth && isAuth.id ? (
              <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  to="logout"
                >
                  Logout
                </Link>
              </Box>
            ) : (
              <div>
                <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    to="login"
                  >
                    Login
                  </Link>
                </Box>
                <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    to="register"
                  >
                    Register
                  </Link>
                </Box>
              </div>
            )}
            {/* Login/register/logout */}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet context={[outletContext, setOutletContext]}/>
    </div>
  );
}
