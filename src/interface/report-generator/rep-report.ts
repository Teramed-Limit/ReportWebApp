import { RepPage } from './rep-page';

export interface RepReport {
    header: RepPage;
    footer: RepPage;
    isDefault: boolean;
    paperSize: 'A4' | 'B5' | 'B3';
}

export interface Point {
    x: number;
    y: number;
}

export interface Size {
    width: number;
    height: number;
}
