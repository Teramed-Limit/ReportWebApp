import React from 'react';

import { ThemeProvider } from '@mui/material';
import { Font } from '@react-pdf/renderer';
import { Route, Switch } from 'react-router-dom';

import InjectAxiosInterceptors from './axios/InjectAxiosInterceptors ';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Login from './container/Login/Login';
import Main from './container/Main/Main';
import { MobxStateProvider } from './context/mobx-custom-provider';
import { ModalProvider } from './context/modal-context';
import { NotificationProvider } from './context/notification-context';
import fonts from './fonts';
import { createStore } from './models/store';
import { rootTheme } from './theme/rootTheme';
import './styles/ag-grid/ag-theme-modal.scss';

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
    return (
        <MobxStateProvider store={rootStore}>
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
        </MobxStateProvider>
    );
}
export default App;
