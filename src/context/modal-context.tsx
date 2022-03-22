import React, { ReactNode, useState } from 'react';

export const ModalContext = React.createContext<
    React.Dispatch<React.SetStateAction<JSX.Element | null>>
>(() => {});

interface Props {
    children: ReactNode;
}

export function ModalProvider(props: Props) {
    const [modal, setModal] = useState<JSX.Element | null>(null);

    return (
        <ModalContext.Provider value={setModal}>
            {modal}
            {props.children}
        </ModalContext.Provider>
    );
}
