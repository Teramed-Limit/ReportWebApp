import { CompositeField } from '../../../src/interface/composite-field';
import { Field } from '../../../src/interface/field';
import {
    colonoscopyFields,
    colonoscopyFreeTextFields,
    ogdFields,
    previewReportApiPath,
    qualityBowelFields,
    query,
    reportApiPath,
    saveReportApiPath,
    signOffReportApiPath,
    standardFields,
} from '../../utils/util';
import { ReportImageDataset } from '../../../src/interface/document-data';

describe('App simulate newly report  flow', () => {
    const triggerHISDataFlow = (type, id, requestJson) => {
        cy.wait(500);
        cy.get(`#navigation__btn-${type}`).click();
        cy.get(`#gridContainer__btn-${id}`).click();
        cy.get('.ag-center-cols-container').within(() => {
            cy.get('[role="row"]').click({ multiple: true });
        });
        requestJson[id] = requestJson[id].map((dataset) => ({ ...dataset, IsSelected: '1' }));
    };

    const variousFieldInputFlow = (field, json) => {
        cy.get(`#${field.id}`).as('input');

        switch (field.type) {
            case 'Text':
                cy.get('@input').type(`${field.id}'s content`, { force: true });
                cy.get('@input').then(($el) => (json[field.id] = $el.val()));
                break;
            case 'Lexicon':
                cy.get('@input').type('Normal', { force: true });
                cy.get('@input').then(($el) => (json[field.id] = $el.val()));
                break;
            case 'TextArea':
                cy.get('@input').scrollIntoView({ offset: { top: -60, left: 0 } });
                cy.get(
                    '@input',
                ).type(
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                    { force: true },
                );
                break;
            case 'AsyncLexicon':
                cy.get('@input').scrollIntoView({ offset: { top: -60, left: 0 } });
                cy.intercept(
                    'GET',
                    `/api/hkcctAlias/type/${field.optionSource.params}?searchStr=test`,
                ).as('hkcctAlias');
                cy.get('@input').type('test', { force: true });
                cy.wait('@hkcctAlias').then(() => {
                    cy.get('#report__menu-list')
                        .find('#report__option')
                        .last()
                        .wait(1000)
                        .click({ force: true });
                });
                cy.get('@input').then(($el) => (json[field.id] = $el.val()));
                break;
            case 'Selection':
                cy.get('@input').scrollIntoView({ offset: { top: -60, left: 0 } });
                cy.get('@input').click();
                cy.get('.report__menu-list').as('optionMenu');
                cy.get('@optionMenu').then((element) => {
                    if (element[0].children[0].innerHTML !== 'No options') {
                        cy.get('@optionMenu').find('.report__option').last().click();
                        if (field.isMulti) cy.get('@optionMenu').type('{esc}');
                    } else {
                        cy.get('@optionMenu').type('{esc}');
                    }
                });
                cy.get('@input')
                    .find(!field.isMulti ? '.report__single-value' : '.report__multi-value__label')
                    .then(($el) => (json[field.id] = !field.isMulti ? $el.text() : [$el.text()]));
                break;
            case 'Checkbox':
                cy.get('@input').check();
                json[field.id] = '1';
                break;
            case 'Number':
                cy.get('@input').type('10');
                json[field.id] = +10;
                break;
            case 'Radio':
                cy.get('@input').find('[type="radio"]').first().check();
                json[field.id] = '1';
                break;
            case 'QualityBowelScore':
                cy.get('@input').find('[id=BBPS_Right__3]').check();
                cy.get('@input').find('[id=BBPS_Transverse__3]').check();
                cy.get('@input').find('[id=BBPS_Left__3]').check();
                json['BBPS_Right'] = 3;
                json['BBPS_Transverse'] = 3;
                json['BBPS_Left'] = 3;
                json['QualityBowelScore'] = 9;
                break;
            default:
                break;
        }
    };

    const handleFieldsByDefine = (fieldsObj: { [prop: string]: Field }, json) => {
        Object.keys(fieldsObj).forEach((id) => {
            const field: Field | CompositeField = fieldsObj[id];
            if (field.id === 'ERSType' || field.id === 'ReportTemplate' || field.readOnly) return;
            const fields = field.type === 'Composite' ? (field as CompositeField).fields : [field];
            fields.forEach((field) => {
                variousFieldInputFlow(field, json);
            });
        });
    };

    const selectERSTemplate = (ersType: string, template: string, requestJson) => {
        cy.get('#ERSType')
            .as('input')
            .click()
            .within(($el) => cy.wrap($el).get('input').type(ersType));
        cy.get('.report__menu-list').find('.report__option').first().click();
        requestJson['ERSType'] = ersType;

        cy.get('#ReportTemplate')
            .as('input')
            .click()
            .within(($el) => cy.wrap($el).get('input').type(template));
        cy.get('.report__menu-list').find('.report__option').first().click();
        requestJson['ReportTemplate'] = template;
    };

    const standardFlow = (fieldsObj: { [prop: string]: Field }, requestJson) => {
        // report page
        handleFieldsByDefine(fieldsObj, requestJson);
        // Quantity Indicator
        cy.get('[class^=App_content]').find('button').contains('Quantity Indicator').click();
        handleFieldsByDefine(qualityBowelFields, requestJson);
        cy.get('[class^=Modal_footer]').find('button').contains('Confirm').click();
        // photo page
        cy.intercept('GET', '/api/diagrams/ersType/**').as('getDiagram');
        cy.get('#navigation__btn-photo').click();
        cy.wait('@getDiagram')
            .its('response.statusCode')
            .should('eq', 200)
            .then(() => {
                cy.get('img[src*="1.3.6.1.4.1.29974.20190806.074551.1"]').as('marker1');
                cy.get('img[src*="1.3.6.1.4.1.29974.20190806.074610.2"]').as('marker2');

                cy.get('[class^=MarkerCanvas_imageMarker]').as('markerCanvas');
                cy.get('@marker1').drag('@markerCanvas', {
                    waitForAnimations: false,
                    position: 'left',
                });
                cy.get('@marker2').drag('@markerCanvas', {
                    waitForAnimations: false,
                    position: 'center',
                });
            });

        cy.wait(500);
        // drag page
        triggerHISDataFlow('drug', 'HISMedicationDataset', requestJson);
        // lab page
        triggerHISDataFlow('lab', 'HISLabRequestsDataset', requestJson);
        // consumable page
        triggerHISDataFlow('consumable', 'HISConsumableDataset', requestJson);
    };

    beforeEach(() => {
        cy.intercept('GET', reportApiPath, { fixture: 'newly-document-data' });
        cy.visit('/', { qs: query });
    });

    it('Newly colonoscopy report save', () => {
        cy.fixture('newly-document-data').then((json) => {
            const requestJson = {
                ...json,
                ProcedureDate: '2020-04-20',
                Author: query.staffCode,
                StaffCode: query.staffCode,
                ChiefEndoscopist: 'Tom Cheung',
                OwnerId: 'Demo User',
            };
            // ERS and Report template
            selectERSTemplate('Colonoscopy', 'Colonoscopy', requestJson);
            // standard flow
            standardFlow(colonoscopyFields, requestJson);

            cy.intercept('GET', previewReportApiPath).as('previewReport');
            cy.intercept('POST', signOffReportApiPath).as('signReport');

            cy.get('#navigation__btn-preview').click();

            cy.wait(`@previewReport`).then((interception) => {
                cy.get('#btn__sign').click();
            });

            cy.wait(`@signReport`).then((interception) => {
                cy.wait(3000);
            });
        });
    });
});
