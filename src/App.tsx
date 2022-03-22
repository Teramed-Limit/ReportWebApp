import React from 'react';

import { observer, Provider } from 'mobx-react';
import { Route, Switch } from 'react-router-dom';

import classes from './App.module.scss';
import Block from './components/Block/Block';
import ErrorPage from './components/ErrorPage/ErrorPage';
import Header from './components/Header/Header';
import Navigation from './components/Navigation/Navigation';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import Spinner from './components/Spinner/Spinner';
import Admin from './container/Admin/Admin';
import Main from './container/Main/Main';
import { ModalProvider } from './context/modal-context';
import { NotificationProvider } from './context/notification-context';
import { createStore } from './models/store';
import { useReportDataStore } from './models/useStore';

const rootStore = createStore();

function App() {
    return (
        <Provider store={rootStore}>
            <NotificationProvider>
                <ModalProvider>
                    <Switch>
                        <Route path="/admin" component={Admin} exact />
                        <Route path="/error" component={ErrorPage} exact />
                        <Route path="/" component={observer(Temp)} />
                        <Route path="*" component={NotFoundPage} />
                    </Switch>
                </ModalProvider>
            </NotificationProvider>
        </Provider>
    );
}
export default App;

function Temp() {
    const { loading } = useReportDataStore();

    return (
        <>
            {loading ? (
                <Block>
                    <Spinner />
                </Block>
            ) : null}

            <div className={classes.container}>
                <Header />
                <Navigation />
                <Main />
            </div>
        </>
    );
}
