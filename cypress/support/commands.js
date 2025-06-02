// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command to fill a form field by label text
Cypress.Commands.add('fillField', (labelText, value) => {
  cy.contains('label', labelText)
    .invoke('attr', 'for')
    .then((id) => {
      cy.get(`#${id}`).clear().type(value);
    });
});

// Custom command to wait for loading to finish
Cypress.Commands.add('waitForLoading', () => {
  // This assumes there's a loading indicator with a specific class or text
  // Adjust the selector based on your application's loading indicator
  cy.get('.loading-indicator').should('not.exist');
});

// Custom command to click a button by text
Cypress.Commands.add('clickButton', (text) => {
  cy.get('button').contains(text).click();
});

// Custom command to click the first button with specific text
Cypress.Commands.add('clickFirstButton', (text) => {
  cy.get('button').contains(text).first().click();
});

// Custom command to click a button by aria-label
Cypress.Commands.add('clickButtonByAriaLabel', (label) => {
  cy.get(`button[aria-label="${label}"]`).click();
});

// Custom command to type in a search field
Cypress.Commands.add('typeInSearch', (text) => {
  cy.get('input[placeholder*="search"]').clear().type(text);
});

// In a real implementation, you might add Auth0 login command
// Cypress.Commands.add('auth0Login', () => { ... })

// Common setup for tests - visits home page and handles auth placeholder
Cypress.Commands.add('setupTest', (options = {}) => {
  // Default options
  const defaultOptions = {
    visitHomePage: true,
    auth: true
  };

  // Merge default options with provided options
  const mergedOptions = { ...defaultOptions, ...options };

  // Visit the home page if specified
  if (mergedOptions.visitHomePage) {
    cy.visit('/');
  }

  // Handle auth placeholder if specified
  if (mergedOptions.auth) {
    // Note: In a real test, we would authenticate first
    // This is a placeholder for when Auth0 is configured for E2E testing
    cy.log('Auth0 login would happen here');
  }
});
