import ReportDynamicLabelComponent from './Components/DynamicLabel/ReportDynamicLabelComponent';
import ReportImageComponent from './Components/Image/ReportImageComponent';
import ReportLabelComponent from './Components/Label/ReportLabelComponent';
import ReportSignatureComponent from './Components/Signature/ReportSignatureComponent';
import { ReportComponentType } from '../../../interface/report-generator/component/rep-component';

export const ReportComponentMapper = {
    [ReportComponentType.Label]: ReportLabelComponent,
    [ReportComponentType.Image]: ReportImageComponent,
    [ReportComponentType.Signature]: ReportSignatureComponent,
    [ReportComponentType.DynamicLabel]: ReportDynamicLabelComponent,
};
