import { colonoscopyDefine } from '../../constant/colonoscopy-define';
import { colonoscopyFreeTextDefine } from '../../constant/colonoscopy-free-text-define';
import { ogdDefine } from '../../constant/ogd-define';
import { standardDefine } from '../../constant/standard-define';
import { FormFieldType } from '../../container/Report/field/field-type';
import { CompositeField } from '../../interface/composite-field';
import { Section } from '../../interface/define';
import { DocumentData } from '../../interface/document-data';
import { Field } from '../../interface/field';

export const normalizeFields = (sections: any[], modalName: string) => {
    const entities = {};
    sections.forEach((section: Section) => {
        section.subSections.forEach((subSection) => {
            subSection.fields.forEach((field) => {
                if (field.type === FormFieldType.Composite) {
                    (field as CompositeField).fields.forEach((fieldInComposite) => {
                        entities[fieldInComposite.id] = {
                            ...fieldInComposite,
                            fromModal: modalName,
                        };
                    });
                } else {
                    entities[field.id] = { ...field, fromModal: modalName };
                }
            });
        });
    });
    return entities;
};

interface DefineMapper {
    fields: any;
    defines: DefineDetail[];
}

interface DefineDetail {
    templateName: string;
    define: any;
}

export const ReportDefineMapper = {
    Standard: {
        fields: normalizeFields(standardDefine.sections, ''),
        defines: [
            {
                templateName: 'All',
                define: standardDefine,
            },
        ],
    },
    Colonoscopy: {
        fields: {
            ...normalizeFields(colonoscopyDefine.sections, ''),
            ...normalizeFields(colonoscopyDefine.modal.sections, colonoscopyDefine.modal.modalName),
        },
        defines: [
            {
                templateName: 'Colonoscopy Free Text',
                define: colonoscopyFreeTextDefine,
            },
            {
                templateName: 'Colonoscopy',
                define: colonoscopyDefine,
            },
        ],
    },
    OGD: {
        fields: normalizeFields(ogdDefine.sections, ''),
        defines: [
            {
                templateName: 'OGD Free Text',
                define: standardDefine,
            },
            {
                templateName: 'OGD',
                define: ogdDefine,
            },
        ],
    },
};

export class ReportDefineService {
    currentFields = ReportDefineMapper.Standard.fields;

    currentERSType = 'Standard';

    currentReportTemplate = 'Standard';

    switchFormDefine = (formData: DocumentData) => {
        if (formData.ERSType && ReportDefineMapper[formData.ERSType]) {
            this.currentFields = ReportDefineMapper[formData.ERSType].fields;
        }

        if (
            !formData.ERSType ||
            !formData.ReportTemplate ||
            !ReportDefineMapper[formData.ERSType]
        ) {
            this.currentERSType = 'Standard';
            this.currentReportTemplate = 'Standard';
            return standardDefine;
        }

        const found = (ReportDefineMapper[formData.ERSType] as DefineMapper).defines.find(
            (x) => x.templateName === formData.ReportTemplate,
        );

        if (!found?.define) {
            this.currentERSType = 'Standard';
            this.currentReportTemplate = 'Standard';
            return standardDefine;
        }

        this.currentERSType = formData.ERSType;
        this.currentReportTemplate = formData.ReportTemplate;
        return found.define;
    };

    getField = (id: string): Field => {
        return this.currentFields[id];
    };
}
