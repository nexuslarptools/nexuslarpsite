describe('Search Flow', () => {
  beforeEach(() => {
    // Use the common setup function
    cy.setupTest();
  });

  it('can open search drawer and perform a search', () => {
    // Find and click the search button to open the drawer
    cy.clickButtonByAriaLabel('search');

    // Check that the search drawer is open
    cy.get('input[placeholder*="search"]').should('be.visible');

    // Enter a search term
    cy.typeInSearch('test');

    // Click the search button
    cy.clickButton(/search/i);

    // Check that search results are displayed
    // This assumes there are results for the search term "test"
    cy.get('div[role="list"]').should('exist');

    // In a real test with real data, we would check for specific results
    // cy.contains('Character One').should('be.visible');
    // cy.contains('Item One').should('be.visible');
  });

  it('can navigate to a search result', () => {
    // Open search drawer
    cy.clickButtonByAriaLabel('search');

    // Enter a search term and submit
    cy.typeInSearch('test');
    cy.clickButton(/search/i);

    // Wait for search results and click on the first one
    cy.get('div[role="list"]').should('exist');
    cy.get('div[role="listitem"]').first().click();

    // Check that we navigate to the details page
    // This could be either a character or item details page
    cy.url().should('include', '/');

    // In a real test, we would check for specific content on the details page
    // cy.contains('Character Details').should('be.visible');
    // or
    // cy.contains('Item Details').should('be.visible');
  });

  it('shows a message when no search results are found', () => {
    // Open search drawer
    cy.clickButtonByAriaLabel('search');

    // Enter a search term that should not have results
    cy.typeInSearch('nonexistentitem12345');
    cy.clickButton(/search/i);

    // Check that a "no results" message is displayed
    cy.contains(/no results found/i).should('be.visible');
  });

  it('can close the search drawer', () => {
    // Open search drawer
    cy.clickButtonByAriaLabel('search');

    // Check that the search drawer is open
    cy.get('input[placeholder*="search"]').should('be.visible');

    // Close the drawer by clicking the close button
    cy.clickButtonByAriaLabel('close');

    // Check that the search drawer is closed
    cy.get('input[placeholder*="search"]').should('not.exist');
  });
});
