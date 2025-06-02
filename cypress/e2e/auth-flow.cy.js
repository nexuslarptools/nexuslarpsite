describe('Authentication Flow', () => {
  beforeEach(() => {
    // Use the common setup function with auth disabled (since we're testing auth)
    cy.setupTest({ auth: false });
  });

  it('shows login button when not authenticated', () => {
    // Check that the login button is visible
    cy.get('button').contains(/log in/i).should('be.visible');
  });

  it('can log in and log out', () => {
    // This test would normally use cy.auth() or similar to authenticate
    // For now, we'll just check that the login button exists
    cy.get('button').contains(/log in/i).should('be.visible');

    // Note: Actual login would require Auth0 integration
    // This is a placeholder for when Auth0 is configured for E2E testing
    cy.log('Auth0 login would happen here');

    // After login, we would check for user menu and logout
    // cy.get('div').contains(/john doe/i).should('be.visible');
    // cy.get('div').contains(/john doe/i).click();
    // cy.get('button').contains(/log out/i).click();
    // cy.get('button').contains(/log in/i).should('be.visible');
  });
});
