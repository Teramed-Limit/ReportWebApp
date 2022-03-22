import React, { useContext } from 'react';

import { ModalContext } from '../../../context/modal-context';
import { createTemplateAction } from '../actions/create-template-action';
import { fillInDetailsAction } from '../actions/fill-in-details-action';
import { qualityIndicatorAction } from '../actions/qualityIndicatorAction';
import { retrieveTemplateAction } from '../actions/retrieve-template-action';

export const ReportActionContext = React.createContext<{
    [propName: string]: (actionParams) => void;
}>({});

interface Props {
    children: React.ReactNode;
}

export function ReportActionProvider(props: Props) {
    const setModal = useContext(ModalContext);
    const [actionMapper] = React.useState<any>({
        quantityIndicator: (actionParams) => qualityIndicatorAction(actionParams, setModal),
        fillInDetails: (actionParams) => fillInDetailsAction(actionParams, setModal),
        retrieveTemplate: (actionParams) => retrieveTemplateAction(actionParams, setModal),
        createTemplate: (actionParams) => createTemplateAction(actionParams),
    });

    const value = React.useMemo(() => actionMapper, [actionMapper]);

    return <ReportActionContext.Provider value={value} {...props} />;
}
