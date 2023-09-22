import { RepComponent } from './component/rep-component';
import { RepImageComponent } from './component/rep-image-component';
import { RepLabelComponent } from './component/rep-label-component';
import { RepLineComponent } from './component/rep-line-component';
import { RepPageNumberComponent } from './component/rep-page-num-component';

export interface RepComponentAttribute
    extends RepComponent,
        RepImageComponent,
        RepLabelComponent,
        RepPageNumberComponent,
        RepLineComponent {}
