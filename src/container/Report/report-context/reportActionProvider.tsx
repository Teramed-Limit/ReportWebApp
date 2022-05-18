import React from 'react';

import { useModal } from '../../../hooks/useModal';
import { BaseActionParams } from '../../../interface/action';
import { createTemplateAction } from '../actions/create-template-action';

export const ReportActionContext = React.createContext<{
    [propName: string]: (actionParams) => void;
}>({});

interface Props {
    children: React.ReactNode;
}

export function ReportActionProvider(props: Props) {
    const [setModalName] = useModal();
    const [actionMapper] = React.useState<any>({
        openModal: (actionParams: { modalName: string } & BaseActionParams) =>
            setModalName(actionParams.modalName),
        createTemplate: (actionParams: BaseActionParams) => createTemplateAction(actionParams),
    });

    const value = React.useMemo(() => actionMapper, [actionMapper]);

    return <ReportActionContext.Provider value={value} {...props} />;
}
