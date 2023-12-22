import { FormFieldType } from '../../container/Report/FieldComponent/field-type';
import { FormDefine, FormDefineMap, Section } from '../../interface/define';
import { ArrayField } from '../../interface/report-field/array-field';
import { CompositeField } from '../../interface/report-field/composite-field';
import { Field } from '../../interface/report-field/field';
import { RepPage } from '../../interface/report-generator/rep-page';

export const initRepPage = (name): RepPage => ({
    name,
    width: 595,
    height: 100,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    components: {},
});

export const normalizeFields = (sections: any[] | undefined, modalName: string | undefined) => {
    if (sections === undefined) return { entities: {}, structureReportEntities: {} };
    const entities = {};
    const structureReportEntities = {};
    sections.forEach((section: Section) => {
        section.subSections.forEach((subSection) => {
            subSection.fields.forEach((field) => {
                if (field.type === FormFieldType.Composite) {
                    (field as CompositeField).fields.forEach((innerCompositeField) => {
                        entities[innerCompositeField.id] = {
                            ...innerCompositeField,
                            fromModal: modalName,
                        };
                        if (innerCompositeField.type === FormFieldType.SRText)
                            structureReportEntities[field.id] = { ...field, fromModal: modalName };
                    });
                } else if (field.type === FormFieldType.Array) {
                    const arrayField = field as ArrayField;
                    if (arrayField.templateField.type === FormFieldType.Composite) {
                        (arrayField.templateField as CompositeField).fields.forEach(
                            (innerCompositeField) => {
                                entities[innerCompositeField.id] = {
                                    ...innerCompositeField,
                                    fromModal: modalName,
                                };
                                if (innerCompositeField.type === FormFieldType.SRText)
                                    structureReportEntities[field.id] = {
                                        ...field,
                                        fromModal: modalName,
                                    };
                            },
                        );
                    } else {
                        entities[arrayField.id] = { ...field, fromModal: modalName };
                        if (arrayField.type === FormFieldType.SRText)
                            structureReportEntities[field.id] = { ...field, fromModal: modalName };
                    }
                } else {
                    entities[field.id] = { ...field, fromModal: modalName };
                    if (field.type === FormFieldType.SRText)
                        structureReportEntities[field.id] = { ...field, fromModal: modalName };
                }
            });
        });
    });
    return { entities, structureReportEntities };
};

export interface RegisterReportDefine {
    formDefine: FormDefine;
    headerDefine: RepPage;
    footerDefine: RepPage;
    imageDefine: Field[];
    fields: { [props: string]: Field };
    structureReportFields: { [props: string]: Field };
}

export const RegisterReportDefineMap: { [props: string]: RegisterReportDefine } = {};

export class ReportDefineService {
    currentFields: Record<string, Field> | undefined;

    registerFormDefine = (defineMap: FormDefineMap) => {
        Object.entries(defineMap).forEach(([k, v]) => {
            if (RegisterReportDefineMap[k]) return;

            // register
            const formDefine = JSON.parse(v.FormDefine) as FormDefine;
            const imageDefine = JSON.parse(v.ImageDefine) as Field[];
            const headerDefine = JSON.parse(v.Header) as RepPage;
            const footerDefine = JSON.parse(v.Footer) as RepPage;

            const { entities, structureReportEntities } = normalizeFields(formDefine.sections, '');
            const { entities: modalEntities } = normalizeFields(
                formDefine?.modal?.sections,
                formDefine?.modal?.modalName,
            );

            RegisterReportDefineMap[k] = {
                formDefine,
                headerDefine,
                footerDefine,
                imageDefine,
                fields: { ...entities, ...modalEntities },
                structureReportFields: structureReportEntities,
            };
        });
    };

    getFormDefine = (reportType: string): RegisterReportDefine => {
        if (!RegisterReportDefineMap[reportType]) {
            console.warn(`report type ${reportType} not found, use Blank instead`);
            // check if Blank exists
            if (RegisterReportDefineMap.Blank) {
                return RegisterReportDefineMap.Blank;
            }

            console.error('Blank not found');
            return {
                fields: {},
                structureReportFields: {},
                formDefine: { sections: [] },
                footerDefine: initRepPage('footer'),
                headerDefine: initRepPage('header'),
                imageDefine: [],
            };
        }

        this.currentFields = RegisterReportDefineMap[reportType].fields;
        return RegisterReportDefineMap[reportType];
    };

    getField = (id: string): Field | undefined => {
        if (!this.currentFields) return undefined;
        return this.currentFields[id];
    };

    getSRField = (id: string): Field | undefined => {
        if (!this.currentFields) return undefined;
        return this.currentFields[id];
    };
}
