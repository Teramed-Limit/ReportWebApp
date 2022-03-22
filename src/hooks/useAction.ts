import React from 'react';

import { ActionParams } from '../interface/action';

export function useAction(
    actionContext: React.Context<{ [propName: string]: (actionParams) => void }>,
) {
    const context = React.useContext(actionContext);

    if (!context) {
        return { execute: () => {} };
    }

    const execute = (action: string, actionParams: ActionParams) => context[action](actionParams);
    return { execute };
}
