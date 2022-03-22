import React from 'react';

import { ActionParams } from '../../../interface/action';
import QualityIndicatorModal from '../../Modals/QualityIndicatorModal/QualityIndicatorModal';

export const qualityIndicatorAction = (
    actionParams: ActionParams,
    setModal: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
) => {
    setModal(<QualityIndicatorModal />);
};
