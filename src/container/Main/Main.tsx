import React, { useEffect } from 'react';

import { observer } from 'mobx-react';

import classes from './Main.module.scss';
import Block from '../../components/Block/Block';
import Header from '../../components/Header/Header';
import Spinner from '../../components/Spinner/Spinner';
import { useOptionStore, useReportDefineStore, useStore } from '../../models/useStore';
import AppRoutes from '../../route/App-route';

const Main = () => {
    const { loading } = useStore();

    // 初始化，reportDefine 和 codeList
    const { fetchDefine } = useReportDefineStore();
    const { initializeCodeList } = useOptionStore();

    useEffect(() => {
        initializeCodeList().then();
        fetchDefine().then();
    }, [fetchDefine, initializeCodeList]);

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
