import {
    previewReportApiPath,
    query,
    reportApiPath,
    saveReportApiPath,
    signOffReportApiPath,
} from '../../utils/util';

describe('App simulate sign off report flow', () => {
    beforeEach(() => {
        cy.intercept('GET', reportApiPath, { fixture: 'signoff-document-data' });
        cy.visit('/', { qs: query });
    });

    it('Sign off report, modify data and directly previews', () => {
        cy.get('#btn__modify').click();
        cy.get(`#Sedation`).type('Modify Sedation');

        cy.intercept('POST', saveReportApiPath).as('saveReport');
        cy.intercept('GET', previewReportApiPath).as('previewReport');
        cy.get('#navigation__btn-preview').click();

        cy.wait(`@saveReport`).then((interception) => {
            expect(interception?.response?.statusCode).eql(200);
            expect(interception?.response?.body).to.deep.equal({ ReportStatus: 'saved' });
        });

        cy.wait(`@previewReport`).then((interception) => {
            expect(interception?.response?.statusCode).eql(200);
            expect(interception?.response?.body).to.have.keys('PDFFilePath');
            cy.get('#btn__sign').click();
        });
    });

    it('Sign off report, modify data and directly sign', () => {
        cy.get('#btn__modify').click();
        cy.get(`#Sedation`).type('Modify Sedation');

        cy.intercept('POST', saveReportApiPath).as('saveReport');
        cy.intercept('POST', signOffReportApiPath).as('signReport');
        cy.get('#btn__sign').click();

        cy.wait(`@saveReport`).then((interception) => {
            expect(interception?.response?.statusCode).eql(200);
            expect(interception?.response?.body).to.deep.equal({ ReportStatus: 'saved' });
        });

        cy.wait(`@signReport`).then((interception) => {
            expect(interception?.response?.statusCode).eql(200);
            expect(interception?.response?.body).to.have.keys(
                'PDFFilePath',
                'SignOffsDateTime',
                'ReportStatus',
            );
            expect(interception?.response?.body.PDFFilePath).to.match(/.pdf$/);
            expect(interception?.response?.body.SignOffsDateTime).to.be.a('string');
            expect(interception?.response?.body.ReportStatus).to.equal('signed');
        });
    });
});
