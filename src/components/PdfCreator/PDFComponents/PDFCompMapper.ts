import PDFDynamicLabelComponent from './PDFDynamicLabelComponent';
import PDFImageComponent from './PDFImageComponent';
import PDFLabelComponent from './PDFLabelComponent';
import PDFSignatureComponent from './PDFSignatureComponent';
import { ReportComponentType } from '../../../interface/report-generator/component/rep-component';

export const PDFReportComponentMapper = {
    [ReportComponentType.Label]: PDFLabelComponent,
    [ReportComponentType.Image]: PDFImageComponent,
    [ReportComponentType.Signature]: PDFSignatureComponent,
    [ReportComponentType.DynamicLabel]: PDFDynamicLabelComponent,
};
