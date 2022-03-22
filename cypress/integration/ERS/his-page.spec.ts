import { query } from '../../utils/util';

const reportApiPath = `/api/report/episodeNo/${query.episodeNo}/procedureId/${query.procedureId}/dept/${query.dept}/staffCode/${query.staffCode}`;

describe('HIS page interaction', () => {
    const hisPageList = ['drug', 'lab', 'consumable'];
    const hisApiPathList = ['/api/medication/**', '/api/lab/**', '/api/consumable/**'];

    beforeEach(() => {
        cy.intercept('GET', reportApiPath, { fixture: 'newly-document-data' });
        cy.visit('/', { qs: query });
    });

    it('Reload button should cancel all check', () => {
        hisPageList.forEach((page, index) => {
            cy.get(`#navigation__btn-${page}`).click();

            cy.intercept('GET', hisApiPathList[index]).as(page);
            cy.get('[class^=GridContainer_table-toolbar]').find('button').first().click();
            cy.wait(`@${page}`).then((interception) => {
                expect(interception?.response?.statusCode).to.equal(200);
                cy.get('.ag-theme-alpine').find('input').should('not.be.checked');
            });
        });
    });
});
