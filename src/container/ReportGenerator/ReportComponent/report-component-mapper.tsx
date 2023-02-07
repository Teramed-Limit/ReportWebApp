import ReportDynamicLabelComponent from './Components/DynamicLabel/ReportDynamicLabelComponent';
import ReportImageComponent from './Components/Image/ReportImageComponent';
import ReportLabelComponent from './Components/Label/ReportLabelComponent';

export enum ReportComponentType {
    General = 'General',
    Label = 'Label',
    DynamicLabel = 'DynamicLabel',
    Image = 'Image',
}

export const ReportComponentMapper = {
    [ReportComponentType.Label]: ReportLabelComponent,
    [ReportComponentType.Image]: ReportImageComponent,
    [ReportComponentType.DynamicLabel]: ReportDynamicLabelComponent,
};
