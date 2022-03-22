import React, { createContext, ReactNode, useState } from 'react';

interface Props {
    children: ReactNode;
}

export const EditViewContext = createContext<
    [boolean, React.Dispatch<React.SetStateAction<boolean>>]
>([false, () => {}]);

export function EditViewProvider(props: Props) {
    const [edit, setEdit] = useState(false);
    return (
        <EditViewContext.Provider value={[edit, setEdit]}>
            {props.children}
        </EditViewContext.Provider>
    );
}
