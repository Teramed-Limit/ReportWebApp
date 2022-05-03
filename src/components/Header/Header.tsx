import React from 'react';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import CakeIcon from '@mui/icons-material/Cake';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import WcIcon from '@mui/icons-material/Wc';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react';
import { AiOutlineFieldNumber } from 'react-icons/all';
import { useHistory } from 'react-router-dom';
import { tap } from 'rxjs/operators';

import WithElementVisibility from '../../HOC/WithElementVisiblity/WithElementVisibility';
import { useAuthStore, useReportDataStore } from '../../models/useStore';
import { isEmptyOrNil } from '../../utils/general';
import NavigationItem from '../Navigation/NavigationItem/NavigationItem';
import ButtonGroup from '../UI/Button-Group/Button-Group';
import Button from '../UI/Button/Button';
import classes from './Header.module.scss';

const Header = () => {
    const history = useHistory();
    const { onLogout } = useAuthStore();
    const { activeStudy } = useReportDataStore();

    const logout = () => {
        onLogout(null, (signal$) => signal$.pipe(tap(() => history.push({ pathname: `/login` }))));
    };

    return (
        <div className={classes.header}>
            <Stack
                className={classes.headerInfo}
                direction="column"
                spacing={1}
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                {!isEmptyOrNil(activeStudy) && (
                    <>
                        <Stack direction="row" spacing={2}>
                            <span className={classes.iconText}>
                                <ContactPageIcon /> {activeStudy?.PatientId}
                            </span>
                            <span className={classes.iconText}>
                                <AiOutlineFieldNumber style={{ fontSize: '24px' }} />
                                {activeStudy?.AccessionNumber}
                            </span>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <span className={classes.iconText}>
                                <AccountCircleIcon /> {activeStudy?.PatientsName}
                            </span>
                            <span className={classes.iconText}>
                                <CakeIcon /> {activeStudy?.PatientsBirthDate}
                            </span>
                            <span className={classes.iconText}>
                                <WcIcon />
                                {activeStudy?.PatientsSex}
                            </span>
                        </Stack>
                    </>
                )}
            </Stack>
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
                    {/*        <NavigationItem link="/setting" id="navigation__setting"> */}
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
