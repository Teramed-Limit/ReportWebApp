import { CompositeField } from '../../../src/interface/composite-field';
import { ReportSetting } from '../../../src/interface/report-setting';
import { PatientProcedureInfo } from '../../../src/interface/procedure-info';
import { formatDateTime, spiltDateTime } from '../../../src/utils/general';
import { Field } from '../../../src/interface/field';
import {
    instrumentApiPath,
    nurseApiPath,
    procedureApiPath,
    query,
    reportApiPath,
    settingApiPath,
    standardFields,
} from '../../utils/util';

describe('Initialize App api response code and error navigation', () => {
    const forceApiFail = (apiPath: string) => {
        cy.intercept('GET', apiPath, {
            times: 1,
            forceNetworkError: true,
        }).as('err');
        cy.visit('/', { qs: query });
        cy.wait('@err').url().should('contain', `/error`);
    };

    it('App initialize all api success', () => {
        // report
        cy.intercept('GET', reportApiPath).as('getReport');
        // procedure
        cy.intercept('GET', procedureApiPath).as('getProcedure');
        // setting
        cy.intercept('GET', settingApiPath).as('getReportSetting');
        // instrument
        cy.intercept('GET', instrumentApiPath).as('getInstruments');
        // nurse
        cy.intercept('GET', nurseApiPath).as('getNurse');

        cy.visit('/', { qs: query });

        cy.wait('@getReport').its('response.statusCode').should('eq', 200);
        cy.wait(['@getProcedure', '@getInstruments', '@getReportSetting', '@getNurse']).then(
            (interceptions) => {
                for (const interception of interceptions) {
                    expect(interception?.response?.statusCode).to.equal(200);
                }
            },
        );

        cy.url().should(
            'contain',
            `/reporting?episodeNo=${query.episodeNo}&procedureId=${query.procedureId}&dept=${query.dept}&staffCode=${query.staffCode}`,
        );
    });

    it('Get report api failed and navigate to /error url', () => {
        forceApiFail(reportApiPath);
    });

    it('Get nurse api failed and navigate to /error url', () => {
        forceApiFail(nurseApiPath);
    });

    it('Get procedure api failed and navigate to /error url', () => {
        forceApiFail(procedureApiPath);
    });

    it('Get instruments api failed and navigate to /error url', () => {
        forceApiFail(instrumentApiPath);
    });

    it('Get setting api failed and navigate to /error url', () => {
        forceApiFail(settingApiPath);
    });
});

describe('All report status accessibility', () => {
    const disabledCheck = (shouldDisabled: boolean) => {
        cy.get('#btn__modify').should(shouldDisabled ? 'not.have.attr' : 'have.attr', 'disabled');
        cy.get('#btn__sign').should(shouldDisabled ? 'have.attr' : 'not.have.attr', 'disabled');
        cy.get('#btn__print').should(shouldDisabled ? 'not.have.attr' : 'have.attr', 'disabled');

        // report page disabled

        Object.keys(standardFields).forEach((id) => {
            const disabledColor = 'rgb(242, 242, 242)';
            const normalColor = 'rgba(0, 0, 0, 0)';

            const field: Field | CompositeField = standardFields[id];
            const fields = field.type === 'Composite' ? (field as CompositeField).fields : [field];
            fields.forEach((field) => {
                cy.get(`#formSectionField__${field.id}`)
                    .find('[class^=FormSectionField_input-field-container]')
                    .should(
                        'have.css',
                        'background-color',
                        field.readOnly || !shouldDisabled ? normalColor : disabledColor,
                    )
                    .within(() => {
                        if (field.readOnly) {
                            cy.get(`#${field.id}`).should('be.disabled');
                            return;
                        }

                        switch (field.type) {
                            case 'Text':
                            case 'TextArea':
                            case 'AsyncLexicon':
                                cy.get(`#${field.id}`).should(
                                    shouldDisabled ? 'be.disabled' : 'not.be.disabled',
                                );
                                break;
                            case 'Selection':
                                cy.get('[class^=BaseSelection_report__container]').should(
                                    shouldDisabled ? 'have.class' : 'not.have.class',
                                    'report--is-disabled',
                                );
                                break;
                            default:
                                break;
                        }
                    });
            });
        });

        // photo page disabled
        cy.get('#navigation__btn-photo').click();
        cy.get('[class^=Photo_container]')
            .find('button')
            .should(shouldDisabled ? 'be.disabled' : 'not.be.disabled');
        cy.get('[class^=Gallery_gallery]')
            .find('input')
            .should(shouldDisabled ? 'be.disabled' : 'not.be.disabled');
        cy.get('[class^=Gallery_gallery]')
            .find('img')
            .each(($el) => {
                expect($el.attr('draggable')).to.equal(shouldDisabled ? 'false' : 'true');
            });

        // his data page
        const hisPageList = ['drug', 'lab', 'consumable'];
        hisPageList.forEach((page) => {
            cy.get(`#navigation__btn-${page}`).click();
            cy.get('[class^=GridContainer_table-toolbar]')
                .find('button')
                .should(shouldDisabled ? 'be.disabled' : 'not.be.disabled');

            cy.get('.ag-cell').each(($el) => {
                shouldDisabled
                    ? expect($el.attr('class')).to.contain('GridTable_disabled')
                    : expect($el.attr('class')).to.not.contain('GridTable_disabled');
            });
        });
    };

    it('Newly report initialize', () => {
        cy.intercept('GET', reportApiPath, { fixture: 'newly-document-data' });
        cy.intercept('GET', procedureApiPath).as('getProcedure');
        cy.intercept('GET', settingApiPath).as('getReportSetting');
        cy.visit('/', { qs: query });

        cy.wait(['@getProcedure', '@getReportSetting']).then(
            ([procedureInterception, settingInterception]) => {
                const procedureRes = procedureInterception?.response
                    ?.body as PatientProcedureInfo[];
                const settingRes = settingInterception?.response?.body as ReportSetting;

                assert.isArray(procedureRes);
                const procedureData = procedureRes[0];
                const {
                    ProcedureCode,
                    ProcedureDatetime,
                    SedationType,
                } = procedureData.LstHISPatientProcedure[0];
                const defaultERSType = settingRes.ReportERSTypeList.find(
                    (option) => option.ProcedureCode === ProcedureCode,
                )?.Name;

                cy.get('#ERSType').within(() => {
                    cy.get('.report__single-value').should('have.text', defaultERSType);
                });
                cy.get('#Sedation').should('have.value', SedationType);
                cy.get('#ProcedureDate').should(
                    'have.value',
                    formatDateTime('YYYY-MM-DD', spiltDateTime(ProcedureDatetime)),
                );
            },
        );

        disabledCheck(false);
    });

    it('Saved report initialize', () => {
        cy.intercept('GET', reportApiPath, { fixture: 'newly-document-data' });
        cy.visit('/', { qs: query });
        disabledCheck(false);
    });

    it('Sign off report', () => {
        cy.intercept('GET', reportApiPath, { fixture: 'signoff-document-data' });
        cy.visit('/', { qs: query });
        disabledCheck(true);
    });
});
