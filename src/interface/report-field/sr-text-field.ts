import { TextField } from './text-field';

export interface SRTextField extends TextField {
    placeholder?: string;
    suffix?: string;
    prefix?: string;
    structureReportPath?: string;
}
