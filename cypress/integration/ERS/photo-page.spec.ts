import { query, reportApiPath } from '../../utils/util';

describe('Photo page interaction', () => {
    beforeEach(() => {
        cy.intercept('GET', reportApiPath, { fixture: 'newly-document-data' });
        cy.visit('/', { qs: query });
        cy.get('#navigation__btn-photo').click();
    });

    it('Click UnAttach all', () => {
        cy.wait(2000);
        cy.get('[class^=Photo_container]').find('button').contains('Unattached All').click();
        cy.get('[class^=Photo_container]').find('input[type=checkbox]').should('not.be.checked');
    });

    it('Click attach all', () => {
        cy.wait(2000);
        cy.get('[class^=Photo_container]').find('button').contains('Attach All').click();
        cy.get('[class^=Photo_container]').find('input[type=checkbox]').should('be.checked');
    });

    it('Sorting image', () => {
        cy.get('img[src*="1.3.6.1.4.1.29974.20190806.074551.1"]').drag(
            'img[src*="1.3.6.1.4.1.29974.20190806.074708.3"]',
        );

        cy.get('div[class^=Gallery_gallery]').find('img').as('imageList');

        cy.get('@imageList').its(0).should('have.id', '1.3.6.1.4.1.29974.20190806.074610.2');
        cy.get('@imageList').its(1).should('have.id', '1.3.6.1.4.1.29974.20190806.074708.3');
        cy.get('@imageList').its(2).should('have.id', '1.3.6.1.4.1.29974.20190806.074551.1');
    });

    it('Sorting image reversely', () => {
        cy.get('img[src*="1.3.6.1.4.1.29974.20190806.074708.3"]').drag(
            'img[src*="1.3.6.1.4.1.29974.20190806.074551.1"]',
        );

        cy.get('div[class^=Gallery_gallery]').find('img').as('imageList');

        cy.get('@imageList').its(0).should('have.id', '1.3.6.1.4.1.29974.20190806.074708.3');
        cy.get('@imageList').its(1).should('have.id', '1.3.6.1.4.1.29974.20190806.074551.1');
        cy.get('@imageList').its(2).should('have.id', '1.3.6.1.4.1.29974.20190806.074610.2');
    });
});

describe('Photo page marker interaction', () => {
    beforeEach(() => {
        cy.intercept('GET', reportApiPath, { fixture: 'newly-document-data' });
        cy.visit('/', { qs: query });
        cy.get('#navigation__btn-photo').click();

        cy.get('img[src*="1.3.6.1.4.1.29974.20190806.074551.1"]').as('marker1');
        cy.get('img[src*="1.3.6.1.4.1.29974.20190806.074610.2"]').as('marker2');
        cy.get('img[src*="1.3.6.1.4.1.29974.20190806.074708.3"]').as('marker3');

        cy.get('[class^=MarkerCanvas_imageMarker]').as('markerCanvas');
        cy.get('@marker1').drag('@markerCanvas', { waitForAnimations: false });
        cy.get('@marker2').drag('@markerCanvas', { waitForAnimations: false });
        cy.get('@marker3').drag('@markerCanvas', { waitForAnimations: false });
    });

    const verifyCheckedElementLeft = (count) => {
        const countToIndex = count - 1;
        cy.get('[class^=Gallery_gallery]')
            .find('input[type=checkbox]')
            .each(($el, index) => {
                if (index <= countToIndex) {
                    cy.wrap($el).should('be.checked');
                    return;
                }
                cy.wrap($el).should('not.be.checked');
            });
    };

    const verifyMarkerLeft = (count) => {
        cy.get('[class^=MarkerCanvas_imageMarker]')
            .find('[class^=MarkerCanvas_marker]')
            .should(($lis) => {
                expect($lis).to.have.length(count);
                for (let index = 0; index < count; index++) {
                    expect($lis.eq(index)).to.contain((index + 1).toString());
                }
            });
    };

    const verifyBadgeLeft = (count) => {
        cy.get('[class^=Gallery_gallery')
            .find('.MuiBadge-badge')
            .should(($lis) => expect($lis).to.have.length(count))
            .each(($el, index) => cy.wrap($el).should('have.text', (index + 1).toString()));
    };

    it('New diagram', () => {
        cy.intercept('GET', '/api/diagrams/ersType/**').as('getDiagram');

        cy.get('[class^=ReportImage_bottom-container]')
            .find('button')
            .contains('New Diagram')
            .click();

        cy.wait('@getDiagram').its('response.statusCode').should('eq', 200);

        verifyCheckedElementLeft(0);
        verifyMarkerLeft(0);
        verifyBadgeLeft(0);
    });

    it('Blank diagram', () => {
        cy.intercept('GET', '/api/diagrams/ersType/**').as('getDiagram');

        cy.get('[class^=ReportImage_bottom-container]')
            .find('button')
            .contains('Blank Diagram')
            .click();

        cy.wait('@getDiagram').its('response.statusCode').should('eq', 200);

        verifyCheckedElementLeft(0);
        verifyMarkerLeft(0);
        verifyBadgeLeft(0);
    });

    it('Mark diagram', () => {
        cy.get('[class^=ReportImage_bottom-container]')
            .find('button')
            .contains('New Diagram')
            .click();
        verifyCheckedElementLeft(0);
        verifyMarkerLeft(0);
        verifyBadgeLeft(0);
    });

    it('Delete marker with menu click', () => {
        cy.get('[class^=MarkerCanvas_imageMarker]')
            .find('[class^=MarkerCanvas_marker]')
            .as('markers');

        cy.get('@markers').last().rightclick();
        cy.get('.MuiListItem-button').click();

        verifyCheckedElementLeft(2);
        verifyMarkerLeft(2);
        verifyBadgeLeft(2);

        cy.get('@markers').first().rightclick({ force: true });
        cy.get('.MuiListItem-button').click();

        verifyMarkerLeft(1);
        verifyBadgeLeft(1);
        cy.get('[class^=Gallery_gallery]')
            .find('input[type=checkbox]')
            .each(($el, index) => {
                if (index === 1) {
                    cy.wrap($el).should('be.checked');
                    return;
                }
                cy.wrap($el).should('not.be.checked');
            });
    });

    it('Delete marker with checkbox', () => {
        cy.get('[class^=Gallery_gallery]')
            .find('input[type=checkbox]')
            .first()
            .uncheck()
            .each(($el, index) => {
                if (index === 1 || index === 2) {
                    cy.wrap($el).should('be.checked');
                    return;
                }
                cy.wrap($el).should('not.be.checked');
            });
        verifyMarkerLeft(2);
        verifyBadgeLeft(2);
    });
});
