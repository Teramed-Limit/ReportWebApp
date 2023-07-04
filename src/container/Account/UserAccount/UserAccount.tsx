import React from 'react';

import { Paper, Typography } from '@mui/material';

import { define } from '../../../constant/setting-define';
import GridTableEditor from '../../../layout/GridTableEditor/GridTableEditor';

const UserAccount = () => {
    return (
        <Paper elevation={3} className="gridTableEditorContainer">
            <Typography variant="h5" gutterBottom component="div" className="header">
                Account
            </Typography>
            <GridTableEditor
                apiPath="account"
                identityId="UserID"
                colDef={define.userAccount.colDef}
                formDef={define.userAccount.formDef}
                initFormData={{}}
            />
        </Paper>
    );
};

export default UserAccount;
