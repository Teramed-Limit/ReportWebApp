import { AxiosResponse } from 'axios';

import { createFieldLexicon } from '../../../../axios/api';
import { BaseActionParams } from '../../../../interface/action';
import { FormFieldLexicon } from '../../../../interface/form-field-lexicon-category';
import { MessageType } from '../../../../interface/notification';
import { isEmptyOrNil } from '../../../../utils/general';

export const createTemplateAction = (actionParams: BaseActionParams) => {
    const selectionText = JSON.parse(
        window.localStorage.getItem('textareaSelectionText') as string,
    );

    if (isEmptyOrNil(actionParams.formData?.ReportTemplate)) {
        actionParams.openNotification(MessageType.Warning, 'Report template not selected yet');
        return;
    }

    if (isEmptyOrNil(selectionText)) {
        actionParams.openNotification(
            MessageType.Warning,
            'User has to select text to create template',
        );
        return;
    }

    const body = {
        Content: selectionText,
        ReportTemplate: actionParams.formData?.ReportTemplate,
        FieldId: actionParams.field.id,
    } as FormFieldLexicon;

    createFieldLexicon(body).subscribe((res: AxiosResponse) => {
        window.localStorage.removeItem('textareaSelectionText');
        return res.status === 200
            ? actionParams.openNotification(MessageType.Success, 'Create template success')
            : actionParams.openNotification(MessageType.Error, 'Create template error');
    });
};
