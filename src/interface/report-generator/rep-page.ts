import { RepComponent } from './component/rep-component';

export interface RepPage {
    name: string;
    width: number;
    height: number;
    paddingTop: number;
    paddingLeft: number;
    paddingBottom: number;
    paddingRight: number;
    components: Record<string, RepComponent>;
}
