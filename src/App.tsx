import './styles/ag-grid/ag-theme-modal.scss';

import React, { useEffect } from 'react';

import { ThemeProvider } from '@mui/material';
import { Font } from '@react-pdf/renderer';
import { Route, Switch } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import { fetchSystemConfig } from './axios/api';
import InjectAxiosInterceptors from './axios/InjectAxiosInterceptors ';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Login from './container/Login/Login';
import Main from './container/Main/Main';
import { MobxStateProvider } from './context/mobx-custom-provider';
import { ModalProvider } from './context/modal-context';
import { NotificationProvider } from './context/notification-context';
import fonts from './fonts';
import { createStore } from './models/store';
import ConfigService from './service/config-service';
import { rootTheme } from './theme/rootTheme';

const rootStore = createStore();
// Register asynchronous loaded fronts before rendering anything.
fonts.map((font) => {
    return Font.register({
        family: font.family,
        fontStyle: font.fontStyle,
        fontWeight: font.fontWeight,
        fonts: font.fonts,
    });
});

function App() {
    useEffect(() => {
        const subscription = fetchSystemConfig().subscribe((res) => {
            ConfigService.setDateFormat(res.data.DateFormat);
            ConfigService.setDateTimeFormat(res.data.DateTimeFormat);
        });
        return () => subscription.unsubscribe();
    }, []);

    return (
        <MobxStateProvider store={rootStore}>
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
        </MobxStateProvider>
    );
}

export default App;
