import { RepComponent } from './rep-component';
import { Font } from './rep-label-component';

export interface RepPageNumberComponent extends RepComponent, Font {
    showTotalPages: boolean;
}
