import { DocumentData } from '../../../interface/document-data';
import { ReportField } from '../../../interface/report-data';

export class ReportTemplate extends ReportField {
    postValueChanged = (data: DocumentData, changeValue: (id, value) => void) => {
        if (data.ReportTemplate !== 'Colonoscopy') {
            changeValue('Terminallleum', '');
            changeValue('Caecum', '');
            changeValue('AscendingColon', '');
            changeValue('Transverse', '');
            changeValue('HepaticFlexure', '');
            changeValue('SplenicFlexure', '');
            changeValue('Descending', '');
            changeValue('Sigmoid', '');
            changeValue('Rectum', '');
        }

        if (data.ReportTemplate !== 'OGD') {
            changeValue('Esophagus', '');
            changeValue('Cardia', '');
            changeValue('Fundus', '');
            changeValue('Corpus', '');
            changeValue('Antrum', '');
            changeValue('Pyloric', '');
            changeValue('D1', '');
            changeValue('D2', '');
        }
    };
}
