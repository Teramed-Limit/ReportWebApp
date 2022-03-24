import { standardDefine } from '../constant/standard-define';
import { ReportDataService } from '../logic/report-data/report-data-service';
import { ReportDefineService } from '../logic/report-define/report-define-service';
import { ValidationService } from '../logic/validation/validation-service';
import { RootStoreModel } from './root-model';

export function createStore() {
    return RootStoreModel.create(
        {
            defineStore: { formDefine: standardDefine },
            dataStore: { loading: false },
            imageStore: { images: [] },
            optionStore: {},
        },
        {
            reportDefineService: new ReportDefineService(),
            reportDataService: new ReportDataService(),
            validationService: new ValidationService(),
        },
    );
}
