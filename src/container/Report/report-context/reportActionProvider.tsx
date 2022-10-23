import React, { useContext } from 'react';

import { ModalContext } from '../../../context/modal-context';
import { BaseActionParams } from '../../../interface/action';
import { FindingTemplateProvider } from '../../Modals/FillInDetailsModal/context/finding-template-context';
import FillInDetailsModal from '../../Modals/FillInDetailsModal/FillInDetailsModal';
import QualityIndicatorModal from '../../Modals/QualityIndicatorModal/QualityIndicatorModal';
import RetrieveTemplateModal from '../../Modals/RetrieveTemplateModal/RetrieveTemplateModal';
import { createTemplateAction } from '../actions/create-template-action';

export const ReportActionContext = React.createContext<{
    [propName: string]: (actionParams) => void;
}>({});

interface Props {
    children: React.ReactNode;
}

const modalMapper = {
    colonoscopyQualityIndicators: () => <QualityIndicatorModal />,
    retrieveTemplate: () => <RetrieveTemplateModal />,
    fillInDetails: (actionParams) => (
        <FindingTemplateProvider>
            <FillInDetailsModal fieldId={actionParams.field.id} />
        </FindingTemplateProvider>
    ),
};

export function ReportActionProvider(props: Props) {
    const setModal = useContext(ModalContext);
    const [actionMapper] = React.useState<any>({
        openModal: (actionParams: { modalName: string } & BaseActionParams) => {
            setModal(modalMapper[actionParams.modalName](actionParams));
        },
        createTemplate: (actionParams: BaseActionParams) => createTemplateAction(actionParams),
    });

    const value = React.useMemo(() => actionMapper, [actionMapper]);

    return <ReportActionContext.Provider value={value} {...props} />;
}
