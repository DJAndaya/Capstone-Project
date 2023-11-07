import { Outlet, Link } from 'react-router-dom'

import { Box, AppBar, Toolbar } from '@mui/material'


export default function Root() {

    return (
        <div>
            <Box marginBottom={10}>
                <AppBar>
                    <Toolbar>
                        <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Link style={{ textDecoration: "none", color: "white", flexGrow: 1 }} to='/'>Home</Link>
                        </Box>
                        {/* add search bar */}
                        <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Link style={{ textDecoration: "none", color: "white" }} to='user/orders'>Orders</Link>
                        </Box>
                        <Box sx={{ marginLeft: 5, marginRight: 5 }}>
                            <Link style={{ textDecoration: "none", color: "white" }} to='user/cart'>Cart</Link>
                        </Box>
                        {/* Login/register/logout */}
                    </Toolbar>
                </AppBar>
            </Box>
            <Outlet />
        </div>
    )
}