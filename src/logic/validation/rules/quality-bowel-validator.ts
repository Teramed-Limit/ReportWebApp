import { DocumentData } from '../../../interface/document-data';
import { ValidateResult, Validator } from '../../../interface/validator';

export class QualityBowelValidator extends Validator {
    errorMessage = 'The total score must be 6 or above';

    validate(value: any, validateParams: any, documentData: DocumentData): ValidateResult {
        if (documentData?.ReportTemplate !== 'Colonoscopy') {
            return {
                isValid: true,
                errorMessage: '',
            };
        }

        if (documentData?.QualityOfBowelPreparation === 'Inadequate') {
            return {
                isValid: true,
                errorMessage: '',
            };
        }

        // // select inadequate or any N/A
        // if (
        //     documentData.BBPS_Left === -1 ||
        //     documentData.BBPS_Right === -1 ||
        //     documentData.BBPS_Transverse === -1
        // ) {
        //     return {
        //         isValid: true,
        //         errorMessage: '',
        //     };
        // }

        if (documentData.QualityBowelScore && documentData.QualityBowelScore >= 6) {
            return {
                isValid: true,
                errorMessage: '',
            };
        }

        return {
            isValid: false,
            errorMessage: this.errorMessage,
        };
    }
}
