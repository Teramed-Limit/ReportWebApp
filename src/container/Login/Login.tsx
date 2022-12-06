import * as React from 'react';
import { useState } from 'react';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Paper } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import { LoginBackground } from '../../assets';
import { useAuthStore } from '../../models/useStore';
import { isEmptyOrNil } from '../../utils/general';
import classes from './Login.module.scss';

function Login() {
    const history = useHistory();
    const { onLogin } = useAuthStore();
    const location = useLocation<{ from: { pathname: string; search: string } }>();
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [loginMsg, setLoginMsg] = useState('');
    const { from } = location.state || { from: { pathname: '/' } };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onLogin({ userId, password }, (signal$) =>
            signal$.pipe(
                tap((message: string) => {
                    if (isEmptyOrNil(message)) history.replace(from);
                    else setLoginMsg(message);
                }),
            ),
        );
    };

    return (
        <Container component="main" sx={{ display: 'flex', padding: '80px', height: '100vh' }}>
            <Paper className={classes.bgPaper} elevation={3}>
                <span className={classes.imageContainer}>
                    <img src={LoginBackground} alt="" />
                </span>
                <Box className={classes.loginForm}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography className={classes.title} component="h1" variant="h5">
                        Hi, Welcome Back
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="userId"
                            label="User"
                            name="userId"
                            autoFocus
                            autoComplete="off"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className={classes.message}>{loginMsg}</div>
                        <Button
                            size="large"
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default observer(Login);
