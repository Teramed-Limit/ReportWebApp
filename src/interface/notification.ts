import { DocumentData } from './document-data';

export interface ReportResponseNotification {
    notification: Notification;
    response?: Partial<DocumentData>;
}

export interface Notification {
    messageType: MessageType;
    message: string;
}

export enum MessageType {
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}
