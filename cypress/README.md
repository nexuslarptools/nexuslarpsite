# Cypress End-to-End Tests

This directory contains end-to-end tests for the NEXUS LARP site using Cypress.

## Test Structure

The tests are organized by user flows:

- **Authentication Flow** (`auth-flow.cy.js`): Tests for login and logout functionality
- **Profile Flow** (`profile-flow.cy.js`): Tests for viewing and editing user profiles
- **Items Flow** (`items-flow.cy.js`): Tests for listing, viewing, creating, and editing items
- **Search Flow** (`search-flow.cy.js`): Tests for searching items and characters

## Running Tests

To run the tests, you can use the following npm scripts:

```bash
# Open Cypress UI for interactive testing
npm run cypress:open

# Run all Cypress tests headlessly
npm run cypress:run

# Run all Cypress tests (alias for cypress:run)
npm run test:e2e
```

## Auth0 Integration

The tests currently include placeholders for Auth0 authentication. In a real implementation, you would need to:

1. Set up Auth0 for testing (using test accounts or a mock)
2. Implement the `auth0Login` command in `cypress/support/commands.js`
3. Update the tests to use the actual authentication flow

## Custom Commands

The following custom commands are available:

- `cy.fillField(labelText, value)`: Fill a form field by its label text
- `cy.waitForLoading()`: Wait for loading indicators to disappear
- `cy.clickButton(text)`: Click a button by its text content

## Notes

- These tests assume the application is running at `http://localhost:3000` (configured in `cypress.config.js`)
- Some tests may need adjustments based on the actual structure and behavior of the application
- For CI/CD integration, you can use the `cypress:run` command in your pipeline