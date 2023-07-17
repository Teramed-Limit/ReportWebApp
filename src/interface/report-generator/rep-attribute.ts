import { RepComponent } from './component/rep-component';
import { RepImageComponent } from './component/rep-image-component';
import { RepLabelComponent } from './component/rep-label-component';
import { RepLineComponent } from './component/rep-line-component';

export interface RepComponentAttribute
    extends RepComponent,
        RepImageComponent,
        RepLabelComponent,
        RepLineComponent {}
