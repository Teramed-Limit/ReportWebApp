import { MutableRefObject } from 'react';

import { AxiosResponse } from 'axios';

import { createFindingsTemplate } from '../../../axios/api';
import { ActionParams } from '../../../interface/action';
import { MessageType } from '../../../interface/notification';
import { TemplateFinding } from '../../../interface/report-finding';
import { isEmptyOrNil } from '../../../utils/general';

export const createTemplateAction = (actionParams: ActionParams) => {
    if (
        (actionParams.ref as MutableRefObject<HTMLTextAreaElement>).current === undefined ||
        actionParams.formData.ERSType === undefined ||
        actionParams.formData.ERSType === ''
    ) {
        actionParams.openNotification(MessageType.Warning, 'ERS type not selected yet');
        return;
    }

    const element = (actionParams.ref as MutableRefObject<HTMLTextAreaElement>).current;
    const selectionText = element.value.substring(element.selectionStart, element.selectionEnd);

    if (isEmptyOrNil(selectionText)) {
        actionParams.openNotification(MessageType.Warning, 'selected text is empty');
        return;
    }

    const body = {
        Content: selectionText,
        ERSType: actionParams.formData.ERSType,
    } as TemplateFinding;

    createFindingsTemplate(body).subscribe((res: AxiosResponse) => {
        return res.status === 200
            ? actionParams.openNotification(MessageType.Success, 'create template success')
            : actionParams.openNotification(MessageType.Error, 'create template error');
    });
};
