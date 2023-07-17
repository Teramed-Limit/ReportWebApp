import { RepComponent } from './rep-component';

export interface RepLabelComponent extends RepComponent {
    fontSize: number;
    fontName: string;
    fontStyle: string;
    fontColor: string;
    fontWeight: number;
    suffix: string;
    prefix: string;
}
