import { format } from 'date-fns';

import { RootStoreModel } from './root-model';
import { LoginResult } from '../interface/auth';
import { ReportDataService } from '../logic/report-data/report-data-service';
import { ReportDefineService } from '../logic/report-define/report-define-service';
import { ValidationService } from '../logic/validation/validation-service';
import { emptyBaseImage } from '../utils/general';

export function createStore() {
    const user = JSON.parse(<string>localStorage.getItem('user')) as LoginResult;
    return RootStoreModel.create(
        {
            authStore: {
                isAuth: !!user,
                functionList: user?.FunctionList,
                accessToken: user?.AccessToken,
                userId: user?.UserId,
                userName: user?.UserName || undefined,
            },
            defineStore: {},
            dataStore: { loading: false },
            imageStore: {
                images: [],
                diagramChanged: false,
                diagramHandle: {
                    onExport(): string {
                        return emptyBaseImage();
                    },
                },
            },
            optionStore: { loading: false },
            queryStore: {
                queryResult: [],
                queryPairData: {
                    StudyDate: `${format(new Date(), 'yyyyMMdd')}-${format(
                        new Date(),
                        'yyyyMMdd',
                    )}`,
                },
            },
        },
        {
            reportDefineService: new ReportDefineService(),
            reportDataService: new ReportDataService(),
            validationService: new ValidationService(),
        },
    );
}
