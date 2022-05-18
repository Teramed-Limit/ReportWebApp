import { MutableRefObject } from 'react';

import { DocumentData } from './document-data';
import { MessageType } from './notification';

export interface BaseActionParams {
    ref: MutableRefObject<any>;
    formData: DocumentData;
    openNotification: (messageType: MessageType, message: string) => void;
}
