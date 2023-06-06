import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button, Grid, Paper, TextField, Typography } from '@mui/material';

import { getUserInfo } from '../../axios/api';
import { httpReq } from '../../axios/axios';
import { LoginResult } from '../../interface/auth';
import LocalStorageService from '../../service/local-storage-service';
import { convertFileToBase64 } from '../../utils/general';
import classes from '../Account/UserAccount/UserAccount.module.scss';

function SelfInfo() {
    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState('');
    const [title, setTitle] = useState('');
    const [signatureUrl, setSignatureUrl] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [summary, setSummary] = useState('');

    useEffect(() => {
        const userId = LocalStorageService.getFromLocalStorage<LoginResult>('user')?.UserId;
        if (!userId) return;
        getUserInfo(userId).subscribe((res) => {
            setUserID(res.data.UserID);
            setUserName(res.data.DoctorEName);
            setTitle(res.data.Title);
            setSignatureUrl(res.data.SignatureUrl);
            setJobTitle(res.data.JobTitle);
            setSummary(res.data.Summary);
        });
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setSignatureUrl(URL.createObjectURL(e.target.files[0]));
        const base64 = (await convertFileToBase64(e.target.files[0])) as string;
        httpReq<boolean>()({
            method: 'post',
            url: `api/account/userId/${userID}`,
            data: { UserId: userID, SignatureUrl: base64.replace(/^data:image\/\w+;base64,/, '') },
        }).subscribe(() => {
            const data = LocalStorageService.getFromLocalStorage<LoginResult>('user');
            if (!data) return;
            data.SignatureUrl = base64;
            LocalStorageService.writeToLocalStorage<LoginResult>('user', data);
        });
    };

    const handleSave = () => {
        httpReq<boolean>()({
            method: 'post',
            url: `api/account/userId/${userID}`,
            data: {
                UserId: userID,
                UserName: userName,
                Title: title,
                JobTitle: jobTitle,
                Summary: summary,
            },
        }).subscribe(() => {
            const data = LocalStorageService.getFromLocalStorage<LoginResult>('user');
            if (!data) return;
            data.UserName = userName;
            data.Title = title;
            data.JobTitle = jobTitle;
            data.Summary = summary;
            LocalStorageService.writeToLocalStorage<LoginResult>('user', data);
        });
    };

    const renderTextField = (label, value, setter, readOnly = false) => (
        <TextField
            label={label}
            variant="outlined"
            fullWidth
            value={value}
            onChange={(e) => setter(e.target.value)}
            margin="normal"
            InputProps={{
                readOnly,
            }}
        />
    );

    return (
        <Grid container spacing={2} p={2}>
            <Grid item xs={8}>
                <Paper style={{ padding: '16px' }} elevation={6}>
                    <Typography
                        variant="h5"
                        gutterBottom
                        component="div"
                        className={classes.sectionHeader}
                    >
                        Account Information
                    </Typography>
                    {renderTextField('User ID', userID, null, true)}
                    {renderTextField('User Name', userName, setUserName)}
                    {renderTextField('Title', title, setTitle)}
                    {renderTextField('JobTitle', jobTitle, setJobTitle)}
                    {renderTextField('Summary', summary, setSummary)}
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Paper>
            </Grid>
            <Grid item xs={4}>
                <Paper style={{ padding: '16px', textAlign: 'center' }} elevation={6}>
                    <Typography variant="h5" gutterBottom className={classes.sectionHeader}>
                        Signatures
                    </Typography>
                    <img
                        src={signatureUrl}
                        alt="Signatures"
                        style={{ maxWidth: '100%', maxHeight: '100%' }}
                    />
                    <TextField
                        style={{ flex: '1' }}
                        type="file"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{ accept: 'image/jpeg,image/png' }}
                        size="small"
                        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                            await handleImageUpload(e);
                        }}
                    />
                </Paper>
            </Grid>
        </Grid>
    );
}

export default SelfInfo;
