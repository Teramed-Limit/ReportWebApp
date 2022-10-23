import { MutableRefObject } from 'react';

import { DocumentData } from './document-data';
import { Field } from './field';
import { MessageType } from './notification';

export interface BaseActionParams {
    ref: MutableRefObject<any>;
    formData: DocumentData;
    field: Field;
    openNotification: (messageType: MessageType, message: string) => void;
}
