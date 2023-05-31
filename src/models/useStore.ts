import React, { createContext } from 'react';

import { MobXProviderContext } from 'mobx-react';

import { AuthStore } from './model-type/auth-type-modal';
import { ImageStore } from './model-type/image-type-modal';
import { OptionStore } from './model-type/options-type-modal';
import { QueryStore } from './model-type/query-type-modal';
import { DataStore } from './model-type/report-data-type-modal';
import { DefineStore } from './model-type/report-define-type-modal';
import { RootStore } from './model-type/root-type-modal';

const RootStoreContext = createContext<null | RootStore>(null);
export const { Provider } = RootStoreContext;

export function useStore(): RootStore {
    return React.useContext(MobXProviderContext).store;
}

export function useOptionStore(): OptionStore {
    return React.useContext(MobXProviderContext).store.optionStore;
}

export function useReportDefineStore(): DefineStore {
    return React.useContext(MobXProviderContext).store.defineStore;
}

export function useReportDataStore(): DataStore {
    return React.useContext(MobXProviderContext).store.dataStore;
}

export function useReportImageStore(): ImageStore {
    return React.useContext(MobXProviderContext).store.imageStore;
}

export function useQueryStore(): QueryStore {
    return React.useContext(MobXProviderContext).store.queryStore;
}

export function useAuthStore(): AuthStore {
    return React.useContext(MobXProviderContext).store.authStore;
}
