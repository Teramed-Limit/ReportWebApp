import './styles/ag-grid/ag-theme-modal.scss';

import React, { useEffect } from 'react';

import { ThemeProvider } from '@mui/material';
import { Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { fetchSystemConfig } from './axios/api';
import InjectAxiosInterceptors from './axios/InjectAxiosInterceptors ';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Login from './container/Login/Login';
import Main from './container/Main/Main';
import { ModalProvider } from './context/modal-context';
import { NotificationProvider } from './context/notification-context';
import { registerFont } from './fonts';
import ConfigService from './service/config-service';
import { rootTheme } from './theme/rootTheme';

registerFont();

function App() {
    useEffect(() => {
        const subscription = fetchSystemConfig().subscribe((res) => {
            ConfigService.setDateFormat(res.data.DateFormat);
            ConfigService.setDateTimeFormat(res.data.DateTimeFormat);
            ConfigService.setSignatureCorrespondingField(res.data.SignatureCorrespondingField);
            ConfigService.setEnableDeleteProtection(res.data.EnableDeleteProtection);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <RecoilRoot>
            <InjectAxiosInterceptors />
            <ThemeProvider theme={rootTheme}>
                <NotificationProvider>
                    <ModalProvider>
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path="/" component={Main} />
                            <Route path="*" component={NotFoundPage} />
                        </Switch>
                    </ModalProvider>
                </NotificationProvider>
            </ThemeProvider>
        </RecoilRoot>
    );
}

export default App;
