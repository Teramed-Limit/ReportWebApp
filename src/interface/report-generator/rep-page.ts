import { RepComponent } from './component/rep-component';

export interface RepPage {
    name: string;
    width: number;
    height: number;
    components: Record<string, RepComponent>;
}
