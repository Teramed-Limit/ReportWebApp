import React from 'react';

import { ActionParams } from '../../../interface/action';
import RetrieveTemplateModal from '../../Modals/RetrieveTemplateModal/RetrieveTemplateModal';

export const retrieveTemplateAction = (
    actionParams: ActionParams,
    setModal: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
) => {
    setModal(<RetrieveTemplateModal />);
};
