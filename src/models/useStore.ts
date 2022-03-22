import React, { createContext } from 'react';

import { MobXProviderContext } from 'mobx-react';

import { OptionStore } from './options-model';
import { DataStore } from './report-data-model';
import { DefineStore } from './report-define-model';
import { ImageStore } from './report-image-model';
import { RootStore } from './root-model';

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
