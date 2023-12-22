import React from 'react';

import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import ContactsIcon from '@mui/icons-material/Contacts';
import FaceIcon from '@mui/icons-material/Face';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { Avatar, ListItemText, Menu, MenuItem, Stack } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import ListItemIcon from '@mui/material/ListItemIcon';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import classes from './Header.module.scss';
import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { useAuthStore } from '../../models/useStore';
import NavigationItem from '../Navigation/NavigationItem/NavigationItem';
import Button from '../UI/Button/Button';
import ButtonGroup from '../UI/Button-Group/Button-Group';

const Header = () => {
    const history = useHistory();
    const { onLogout, renewUserInfo, userId, userName } = useAuthStore();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const reloadUserInfo = () => {
        if (!userId) return;
        renewUserInfo({ userId });
        setAnchorEl(null);
    };

    const navigateSelfProfile = () => {
        history.push('/selfInfo');
        setAnchorEl(null);
    };

    const logout = () => {
        onLogout(null, (signal$) => signal$.pipe(tap(() => history.push({ pathname: `/login` }))));
    };

    return (
        <div className={classes.header}>
            <Stack className={classes.headerInfo} direction="column" spacing={1} />
            <div className={classes.headerSidebar}>
                <ButtonGroup>
                    <NavigationItem link="/" id="navigation__home">
                        <Button id="btn__home" color="black">
                            <HomeRoundedIcon className={classes.iconButton} />
                            Home
                        </Button>
                    </NavigationItem>
                    <WithElementVisibility
                        wrappedComp={
                            <NavigationItem link="/account" id="navigation__account">
                                <Button id="btn__account" color="black">
                                    <AccountCircleSharpIcon className={classes.iconButton} />
                                    Account
                                </Button>
                            </NavigationItem>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <NavigationItem link="/settings" id="navigation__setting">
                                <Button id="btn__setting" color="black">
                                    <SettingsIcon className={classes.iconButton} />
                                    Settings
                                </Button>
                            </NavigationItem>
                        }
                    />
                    <WithElementVisibility
                        wrappedComp={
                            <NavigationItem
                                link="/login-status-management"
                                id="navigation__loginStatusManagement"
                            >
                                <Button id="btn__login-status-management" color="black">
                                    <FaceIcon className={classes.iconButton} />
                                    Login Status
                                </Button>
                            </NavigationItem>
                        }
                    />
                    <NavigationItem link="/report-generator">
                        <Button id="btn__report-generator" color="black">
                            <SummarizeIcon className={classes.iconButton} />
                            Report Generator
                        </Button>
                    </NavigationItem>
                    <Button id="btn__logout" color="black" onClick={logout}>
                        <LogoutRoundedIcon className={classes.iconButton} />
                        Logout
                    </Button>

                    <Button id="btn__selfInfo" color="black" onClick={openMenu}>
                        <Avatar
                            className={classes.avatarImg}
                            sx={{ bgcolor: deepOrange[500] }}
                            src="/broken-image.jpg"
                        />
                        {userName}
                    </Button>
                    <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={navigateSelfProfile}>
                            <ListItemIcon>
                                <ContactsIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>My Profile</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={reloadUserInfo}>
                            <ListItemIcon>
                                <CloudSyncIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Sync Signature</ListItemText>
                        </MenuItem>
                    </Menu>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default observer(Header);
