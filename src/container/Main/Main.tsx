import React, { useEffect } from 'react';

import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import AppRoutes from '../../App-route';
import classes from '../../App.module.scss';
import Block from '../../components/Block/Block';
import Header from '../../components/Header/Header';
import Navigation from '../../components/Navigation/Navigation';
import Spinner from '../../components/Spinner/Spinner';
import { useModal } from '../../hooks/useModal';
import { useReportDataStore } from '../../models/useStore';

const Main = () => {
    const { loading } = useReportDataStore();
    const [setModalName] = useModal();
    const history = useHistory();
    const { formValidation } = useReportDataStore();

    useEffect(() => {
        if (!formValidation.isValid) {
            history.push(`/reporting`);
            setModalName(formValidation.openModalName);
        }
    }, [formValidation, history, setModalName]);

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
                <main className={classes.content}>
                    <AppRoutes />
                </main>
            </div>
        </>
    );
};

export default observer(Main);
