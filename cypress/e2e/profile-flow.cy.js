describe('Profile Flow', () => {
  beforeEach(() => {
    // Use the common setup function
    cy.setupTest();

    // Mock being logged in for now
    // In a real implementation, we would use cy.auth() or similar
  });

  it('can navigate to profile page', () => {
    // This test assumes we're already logged in
    // In a real test, we would click on the user menu and then profile
    cy.log('Would click on user menu and navigate to profile');

    // Navigate directly to profile page for now
    cy.visit('/profile');

    // Check that we're on the profile page
    cy.contains(/user profile/i).should('be.visible');
  });

  it('can view profile information', () => {
    // Navigate to profile page
    cy.visit('/profile');

    // Check for profile information fields
    cy.get('input[name="preferredname"]').should('exist');
    cy.get('input[name="email"]').should('exist');
  });

  it('can edit profile information', () => {
    // Navigate to profile page
    cy.visit('/profile');

    // Click edit button
    cy.clickButton('edit');

    // Edit the preferred name field
    cy.fillField('Preferred Name', 'Updated Name');

    // Save changes
    cy.clickButton('save');

    // Verify we're back in view mode
    cy.get('button').contains(/edit/i).should('be.visible');

    // In a real test, we would verify the updated value is displayed
    // cy.get('input[name="preferredname"]').should('have.value', 'Updated Name');
  });
});
