import { FormFieldType } from '../../container/Report/field/field-type';
import { CompositeField } from '../../interface/composite-field';
import { FormDefine, FormDefineMap, Section } from '../../interface/define';
import { Field } from '../../interface/field';

export const normalizeFields = (sections: any[] | undefined, modalName: string | undefined) => {
    if (sections === undefined) return;
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

export interface RegisterReportDefine {
    formDefine: FormDefine;
    pdfDefine: FormDefine;
    fields: { [props: string]: Field };
}

export const RegisterReportDefineMap: { [props: string]: RegisterReportDefine } = {};

export class ReportDefineService {
    currentFields;

    registerFormDefine = (defineMap: FormDefineMap) => {
        Object.entries(defineMap).forEach(([k, v]) => {
            if (RegisterReportDefineMap[k]) return;
            // register
            const formDefine = JSON.parse(v.FormDefine) as FormDefine;
            const pdfDefine = JSON.parse(v.PDFDefine) as FormDefine;
            RegisterReportDefineMap[k] = {
                formDefine,
                pdfDefine,
                fields: {
                    ...normalizeFields(formDefine.sections, ''),
                    ...normalizeFields(formDefine?.modal?.sections, formDefine?.modal?.modalName),
                },
            };
        });
    };

    getFormDefine = (reportType: string): RegisterReportDefine => {
        if (!RegisterReportDefineMap[reportType]) {
            console.error(`${reportType} not found`);
        }

        this.currentFields = RegisterReportDefineMap[reportType].fields;

        return RegisterReportDefineMap[reportType];
    };

    getField = (id: string): Field | undefined => {
        if (!this.currentFields) return undefined;
        return this.currentFields[id];
    };
}
