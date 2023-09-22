import { DocumentData } from './document-data';
import { MessageType } from './notification';
import { Field } from './report-field/field';

export interface BaseActionParams {
    formData: DocumentData;
    field: Field;
    openNotification: (messageType: MessageType, message: string) => void;
}
