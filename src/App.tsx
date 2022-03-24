import React from 'react';

import { ThemeProvider } from '@mui/material';
import { Provider } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';

import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Main from './container/Main/Main';
import { ModalProvider } from './context/modal-context';
import { NotificationProvider } from './context/notification-context';
import { createStore } from './models/store';
import { rootTheme } from './theme/rootTheme';

const rootStore = createStore();

function App() {
    return (
        <Provider store={rootStore}>
            <ThemeProvider theme={rootTheme}>
                <NotificationProvider>
                    <ModalProvider>
                        <Switch>
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
