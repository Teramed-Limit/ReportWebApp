import React from 'react';

import { observer } from 'mobx-react';
import { Redirect, Route } from 'react-router-dom';

import { useAuthStore } from '../models/useStore';

interface Props {
    exact: boolean;
    path: string;
    component: JSX.Element;
}

function AdminRoute({ component, ...rest }: Props) {
    const { isAdmin } = useAuthStore();
    return (
        <Route
            {...rest}
            render={() => (isAdmin ? component : <Redirect to={{ pathname: '/' }} />)}
        />
    );
}

export default observer(AdminRoute);
