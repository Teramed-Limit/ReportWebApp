import React, { useEffect } from 'react';

import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import AppRoutes from '../../App-route';
import Block from '../../components/Block/Block';
import Header from '../../components/Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import { useModal } from '../../hooks/useModal';
import { useReportDataStore, useStore } from '../../models/useStore';
import classes from './Main.module.scss';

const Main = () => {
    const { formValidation } = useReportDataStore();
    const { loading } = useStore();
    const [setModalName] = useModal();
    const history = useHistory();

    useEffect(() => {
        if (!formValidation.isValid) {
            setModalName(formValidation.openModalName);
        }
    }, [formValidation, history, setModalName]);

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
