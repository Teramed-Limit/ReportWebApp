import React from 'react';

import Box from '@mui/material/Box';

import UserAccount from './UserAccount/UserAccount';
import UserRoles from './UserRoles/UserRoles';

const Account = () => {
    return (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <UserAccount />
            <UserRoles />
        </Box>
    );
};

export default Account;
