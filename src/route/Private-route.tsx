import React from 'react';

import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

import { useAuthStore } from '../models/useStore';

interface Props {
    exact: boolean;
    path: string;
    component: JSX.Element;
}

function PrivateRoute({ component, ...rest }: Props) {
    const { isAuth } = useAuthStore();
    return (
        <Route
            {...rest}
            render={() => (isAuth ? component : <Redirect to={{ pathname: '/login' }} />)}
        />
    );
}

export default observer(PrivateRoute);
