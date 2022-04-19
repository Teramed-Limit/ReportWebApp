import React from 'react';

import { ThemeProvider } from '@mui/material';
import { Provider } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';

import InjectAxiosInterceptors from './axios/InjectAxiosInterceptors ';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Login from './container/Login/Login';
import Main from './container/Main/Main';
import { ModalProvider } from './context/modal-context';
import { NotificationProvider } from './context/notification-context';
import { createStore } from './models/store';
import { rootTheme } from './theme/rootTheme';
import './styles/ag-grid/ag-theme-modal.scss';

const rootStore = createStore();

function App() {
    return (
        <Provider store={rootStore}>
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
        </Provider>
    );
}
export default App;
