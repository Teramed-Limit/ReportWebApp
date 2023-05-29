import './index.css';
import './styles/index';

import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { fetchAppConfig } from './axios/axios';
import { MobxStateProvider } from './context/mobx-custom-provider';
import { createStore } from './models/store';
import reportWebVitals from './reportWebVitals';

fetchAppConfig().then(() => {
    const rootStore = createStore();
    ReactDOM.render(
        <BrowserRouter>
            <MobxStateProvider store={rootStore}>
                <App />
            </MobxStateProvider>
        </BrowserRouter>,
        document.getElementById('root'),
    );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
