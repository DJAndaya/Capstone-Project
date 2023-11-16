import * as React from "react";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltSharpIcon from "@mui/icons-material/PeopleAltSharp";
import QrCodeSharpIcon from "@mui/icons-material/QrCodeSharp";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem key="All Products" disablePadding>
          <ListItemButton component={Link} to="/admin/allproducts">
            <ListItemIcon>
              <QrCodeSharpIcon />
            </ListItemIcon>
            <ListItemText primary="All Products" />
          </ListItemButton>
        </ListItem>
        <ListItem key="All Users" disablePadding>
          <ListItemButton component={Link} to="/admin/allusers">
            <ListItemIcon>
              <PeopleAltSharpIcon />
            </ListItemIcon>
            <ListItemText primary="All Users" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <ListItem key="Admin" disablePadding>
          <ListItemButton component={Link} to="/admin/">
            <ListItemIcon>
              <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText primary="Back to Admin page" />
          </ListItemButton>
        </ListItem>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>
            <MenuIcon />
          </Button>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
