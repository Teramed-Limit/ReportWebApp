import React, { useState } from 'react';

import { Paper, Typography } from '@mui/material';

import classes from './UserAccount.module.scss';
import { define } from '../../../constant/setting-define';
import GridTableEditor from '../../../layout/GridTableEditor/GridTableEditor';

const UserAccount = () => {
    const [initFormData] = useState({
        CreateDateTime: '',
        CreateUser: '',
        ModifiedDateTime: '',
        ModifiedUser: '',
        DoctorCName: '',
        DoctorCode: '',
        DoctorEName: '',
        IsSupervisor: '',
        Qualification: '',
        RoleList: [],
        SignatureBase64: '',
        title: '',
        userID: '',
        userPassword: '',
        confirmPassword: '',
    });

    return (
        <Paper elevation={3} className={classes.container}>
            <Typography variant="h5" gutterBottom component="div" className={classes.sectionHeader}>
                Account
            </Typography>
            <GridTableEditor
                apiPath="account"
                identityId="UserID"
                colDef={define.userAccount.colDef}
                formDef={define.userAccount.formDef}
                initFormData={initFormData}
            />
        </Paper>
    );
};

export default UserAccount;
