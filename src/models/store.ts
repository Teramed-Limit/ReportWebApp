import { standardDefine } from '../constant/standard-define';
import { ReportDataService } from '../logic/report-data/report-data-service';
import { ReportDefineService } from '../logic/report-define/report-define-service';
import { ValidationService } from '../logic/validation/validation-service';
import { RootStoreModel } from './root-model';

export function createStore() {
    const queryParamsStr = window.location.search;
    const params = new URLSearchParams(queryParamsStr);
    return RootStoreModel.create(
        {
            defineStore: { formDefine: standardDefine },
            dataStore: { loading: false },
            imageStore: { images: [] },
            optionStore: {},
            queryParams: {
                episodeNo: params.get('episodeNo') || '',
                procedureId: params.get('procedureId') || '',
                dept: params.get('dept') || '',
                staffCode: params.get('staffCode') || '',
            },
        },
        {
            reportDefineService: new ReportDefineService(),
            reportDataService: new ReportDataService(),
            validationService: new ValidationService(),
        },
    );
}
