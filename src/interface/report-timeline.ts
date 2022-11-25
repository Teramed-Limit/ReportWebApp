import { ReportStatus } from './document-data';

export interface ReportStatusTimeline {
    Version: number;
    Author: string;
    DateTime: Date;
    ReportStatus: ReportStatus;
}

export interface ReportTimelineData {
    Timelines: ReportStatusTimeline[];
    MaxVersion: number;
    MinVersion: number;
}
