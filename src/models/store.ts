import { standardDefine } from '../constant/standard-define';
import { LoginResult } from '../interface/auth';
import { ReportDataService } from '../logic/report-data/report-data-service';
import { ReportDefineService } from '../logic/report-define/report-define-service';
import { ValidationService } from '../logic/validation/validation-service';
import { dateToStr } from '../utils/general';
import { RootStoreModel } from './root-model';

export function createStore() {
    const user = JSON.parse(<string>localStorage.getItem('user')) as LoginResult;
    return RootStoreModel.create(
        {
            authStore: {
                isAuth: !!user,
                functionList: user?.FunctionList,
                accessToken: user?.AccessToken,
                refreshToken: user?.RefreshToken,
                loginUser: user?.UserName,
            },
            defineStore: { formDefine: standardDefine },
            dataStore: { loading: false },
            imageStore: { images: [] },
            optionStore: {},
            queryStore: {
                queryResult: [],
                queryPairData: {
                    StudyDate: `${dateToStr(new Date())}-${dateToStr(new Date())}`,
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
