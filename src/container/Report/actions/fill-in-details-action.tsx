import React from 'react';

import { ActionParams } from '../../../interface/action';
import { FindingTemplateProvider } from '../../Modals/FillInDetailsModal/context/finding-template-context';
import FillInDetailsModal from '../../Modals/FillInDetailsModal/FillInDetailsModal';

export const fillInDetailsAction = (
    actionParams: ActionParams,
    setModal: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
) => {
    setModal(
        <FindingTemplateProvider>
            <FillInDetailsModal />
        </FindingTemplateProvider>,
    );
};
