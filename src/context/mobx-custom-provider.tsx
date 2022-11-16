import React from 'react';

import { MobXProviderContext } from 'mobx-react';

export function MobxStateProvider({ children, ...newStores }) {
    const stores = React.useContext(MobXProviderContext);
    return (
        <MobXProviderContext.Provider value={{ ...stores, ...newStores }}>
            {children}
        </MobXProviderContext.Provider>
    );
}
