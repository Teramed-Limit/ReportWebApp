import React, { useEffect } from 'react';

import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';

import AppRoutes from '../../App-route';
import classes from '../../App.module.scss';
import { useModal } from '../../hooks/useModal';
import { useReportDataStore } from '../../models/useStore';

const Main = () => {
    const [setModalName] = useModal();
    const history = useHistory();
    const location = useLocation();
    const queryStr = location.search;
    const { formValidation } = useReportDataStore();

    useEffect(() => {
        if (!formValidation.isValid) {
            history.push(`/reporting${queryStr}`);
            setModalName(formValidation.openModalName);
        }
    }, [formValidation, history, queryStr, setModalName]);

    return (
        <main className={classes.content}>
            <AppRoutes />
        </main>
    );
};

export default observer(Main);
