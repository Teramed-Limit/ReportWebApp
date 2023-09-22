import { RepComponent } from './rep-component';

export interface RepLineComponent extends RepComponent {
    width: number;
    height: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    thickness: number;
}
