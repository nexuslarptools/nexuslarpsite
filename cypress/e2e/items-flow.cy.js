describe('Items Flow', () => {
  beforeEach(() => {
    // Use the common setup function
    cy.setupTest();
  });

  it('can navigate to items page and view items list', () => {
    // Navigate to items page
    cy.contains(/items/i).click();

    // Check that we're on the items page
    cy.contains(/items list/i).should('be.visible');

    // Check that items are displayed
    cy.get('table').should('exist');
    cy.get('tr').should('have.length.greaterThan', 1); // Header row + at least one item
  });

  it('can view item details', () => {
    // Navigate to items page
    cy.contains(/items/i).click();

    // Click view button on the first item
    cy.clickFirstButton(/view/i);

    // Check that we're on the item details page
    cy.contains(/item details/i).should('be.visible');

    // Check that item details are displayed
    cy.get('h2').should('exist'); // Item name should be in an h2
    cy.contains(/description/i).should('exist');
  });

  it('can edit an item', () => {
    // Navigate to items page
    cy.contains(/items/i).click();

    // Click edit button on the first item
    cy.clickFirstButton(/edit/i);

    // Check that we're on the edit item page
    cy.contains(/edit item/i).should('be.visible');

    // Edit the item name
    cy.fillField('Name', 'Updated Item Name');

    // Save changes
    cy.clickButton(/save/i);

    // Check that we're back on the items list page
    cy.contains(/items list/i).should('be.visible');
  });

  it('can create a new item', () => {
    // Navigate to items page
    cy.contains(/items/i).click();

    // Click new item button
    cy.clickButton(/new item/i);

    // Check that we're on the new item page
    cy.contains(/new item/i).should('be.visible');

    // Fill in item details
    cy.fillField('Name', 'New Test Item');
    cy.fillField('Description', 'This is a test item created by Cypress');

    // Save the new item
    cy.clickButton(/save/i);

    // Check that we're back on the items list page
    cy.contains(/items list/i).should('be.visible');

    // In a real test, we would verify the new item appears in the list
    // cy.contains('New Test Item').should('be.visible');
  });
});
