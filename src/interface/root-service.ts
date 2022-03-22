import { ReportDataService } from '../logic/report-data/report-data-service';
import { ReportDefineService } from '../logic/report-define/report-define-service';
import { ValidationService } from '../logic/validation/validation-service';

export interface RootService {
    reportDefineService: ReportDefineService;
    reportDataService: ReportDataService;
    validationService: ValidationService;
}
