import { DocumentData } from './document-data';
import { Field } from './field';
import { MessageType } from './notification';

export interface BaseActionParams {
    formData: DocumentData;
    field: Field;
    openNotification: (messageType: MessageType, message: string) => void;
}
