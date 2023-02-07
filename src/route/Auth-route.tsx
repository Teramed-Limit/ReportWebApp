import React from 'react';

import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

import NotFoundPage from '../components/NotFoundPage/NotFoundPage';
import { useAuthStore } from '../models/useStore';

interface Props {
    id: string;
    exact: boolean;
    path: string;
    component: JSX.Element;
}

function AuthRoute({ component, id, ...rest }: Props) {
    const { isAuth, functionList } = useAuthStore();

    const renderer = () => {
        const isAuthorize = !!functionList.find(
            (roleFunction) => roleFunction.CorrespondElementId === id,
        );

        if (!isAuth) {
            return <Redirect to={{ pathname: '/login' }} />;
        }

        if (isAuthorize) {
            return <Route {...rest} render={() => component} />;
        }

        return <NotFoundPage />;
    };

    return renderer();
}

export default observer(AuthRoute);
