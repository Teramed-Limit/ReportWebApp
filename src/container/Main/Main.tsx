import React from 'react';

import { observer } from 'mobx-react';

import AppRoutes from '../../App-route';
import Block from '../../components/Block/Block';
import Header from '../../components/Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import { useStore } from '../../models/useStore';
import classes from './Main.module.scss';

const Main = () => {
    const { loading } = useStore();

    return (
        <div className={classes.container}>
            {loading ? (
                <Block>
                    <Spinner />
                </Block>
            ) : null}
            <Header />
            <main className={classes.content}>
                <AppRoutes />
            </main>
        </div>
    );
};

export default observer(Main);
