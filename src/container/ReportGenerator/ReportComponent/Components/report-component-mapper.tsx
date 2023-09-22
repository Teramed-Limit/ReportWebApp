import ReportDynamicLabelComponent from './DynamicLabel/ReportDynamicLabelComponent';
import ReportImageComponent from './Image/ReportImageComponent';
import ReportLabelComponent from './Label/ReportLabelComponent';
import ReportLineComponent from './Line/ReportLineComponent';
import ReportPageNumberComponent from './PageNumber/ReportPageNumberComponent';
import ReportSignatureComponent from './Signature/ReportSignatureComponent';
import { ReportComponentType } from '../../../../interface/report-generator/component/rep-component';

export const ReportComponentMapper = {
    [ReportComponentType.Label]: ReportLabelComponent,
    [ReportComponentType.Image]: ReportImageComponent,
    [ReportComponentType.Signature]: ReportSignatureComponent,
    [ReportComponentType.DynamicLabel]: ReportDynamicLabelComponent,
    [ReportComponentType.Line]: ReportLineComponent,
    [ReportComponentType.PageNumber]: ReportPageNumberComponent,
};
