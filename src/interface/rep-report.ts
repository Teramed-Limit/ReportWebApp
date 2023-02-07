import { ReportComponentType } from '../container/ReportGenerator/ReportComponent/report-component-mapper';

export interface RepReport {
    header: RepPage;
    footer: RepPage;
    isDefault: boolean;
    paperSize: 'A4' | 'B5' | 'B3';
}

export interface RepPage {
    name: string;
    height: number;
    components: Record<string, RepComponent>;
}

export interface RepComponent {
    uuid: string;
    x: number;
    y: number;
    componentType: ReportComponentType;
    valueType: string;
    value: string;
}

export interface RepLabelComponent extends RepComponent {
    fontSize: number;
    fontName: string;
    fontStyle: string;
    fontColor: string;
    fontWeight: number;
}

export interface RepImageComponent extends RepComponent {
    height: number;
    width: number;
}

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}
