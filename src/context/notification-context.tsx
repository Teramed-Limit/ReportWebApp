import React, { createContext, ReactNode, useCallback, useRef, useState } from 'react';

import { Snackbar, SnackbarOrigin } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { MessageType, Notification } from '../interface/notification';

interface Props {
    children: ReactNode;
}

const messageFunc = {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    openNotification: (messageType: MessageType, message: string) => {},
    setInfoNotification: (message: string) => {},
    setSuccessNotification: (message: string) => {},
    setWarningNotification: (message: string) => {},
    setErrorNotification: (message: string) => {},
    /* eslint-disable @typescript-eslint/no-unused-vars */
};

export const NotificationContext = createContext<typeof messageFunc>(messageFunc);

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export function NotificationProvider(props: Props) {
    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<Notification>({
        messageType: MessageType.Success,
        message: '',
    });

    const openNotification = useCallback((messageType: MessageType, message: string) => {
        setNotification({ messageType, message });
        setOpen(true);
    }, []);

    const setSuccessNotification = useCallback((message: string) => {
        setNotification({ messageType: MessageType.Success, message });
        setOpen(true);
    }, []);

    const setInfoNotification = useCallback((message: string) => {
        setNotification({ messageType: MessageType.Info, message });
        setOpen(true);
    }, []);

    const setWarningNotification = useCallback((message: string) => {
        setNotification({ messageType: MessageType.Warning, message });
        setOpen(true);
    }, []);

    const setErrorNotification = useCallback((message: string) => {
        setNotification({ messageType: MessageType.Error, message });
        setOpen(true);
    }, []);

    const attribute = useRef<SnackbarOrigin>({
        vertical: 'bottom',
        horizontal: 'right',
    });

    const { vertical, horizontal } = attribute.current;

    return (
        <NotificationContext.Provider
            value={{
                openNotification,
                setSuccessNotification,
                setInfoNotification,
                setWarningNotification,
                setErrorNotification,
            }}
        >
            <Snackbar
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                onClose={() => setOpen(false)}
                autoHideDuration={2000}
                key={vertical + horizontal}
            >
                <Alert severity={notification.messageType}>{notification.message}</Alert>
            </Snackbar>
            {props.children}
        </NotificationContext.Provider>
    );
}
