import { TextField } from './text-field';

export interface SRTextField extends TextField {
    structureReportPath?: string;
    daysToWeeks?: boolean;
    formula?: string;
}
