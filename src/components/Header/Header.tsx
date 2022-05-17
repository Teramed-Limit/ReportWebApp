import React from 'react';

import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
// import SettingsIcon from '@mui/icons-material/Settings';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { useAuthStore } from '../../models/useStore';
import NavigationItem from '../Navigation/NavigationItem/NavigationItem';
import ButtonGroup from '../UI/Button-Group/Button-Group';
import Button from '../UI/Button/Button';
import classes from './Header.module.scss';

const Header = () => {
    const history = useHistory();
    const { onLogout } = useAuthStore();

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
                    {/* <WithElementVisibility */}
                    {/*    wrappedComp={ */}
                    {/*        <NavigationItem link="/settings" id="navigation__setting"> */}
                    {/*            <Button id="btn__setting" color="black"> */}
                    {/*                <SettingsIcon className={classes.iconButton} /> */}
                    {/*                Settings */}
                    {/*            </Button> */}
                    {/*        </NavigationItem> */}
                    {/*    } */}
                    {/* /> */}
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
                    <NavigationItem link="/login" id="navigation__logout">
                        <Button id="btn__logout" color="black" onClick={logout}>
                            <LogoutRoundedIcon className={classes.iconButton} />
                            Logout
                        </Button>
                    </NavigationItem>
                </ButtonGroup>
            </div>
        </div>
    );
};

export default observer(Header);
