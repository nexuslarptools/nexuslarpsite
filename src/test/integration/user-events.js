import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Helper function to click a button by its text
 * @param {string} buttonText - The text of the button to click
 * @returns {Promise<void>}
 */
export const clickButton = async (buttonText) => {
  const button = screen.getByRole('button', { name: buttonText });
  await userEvent.click(button);
};

/**
 * Helper function to click a link by its text
 * @param {string} linkText - The text of the link to click
 * @returns {Promise<void>}
 */
export const clickLink = async (linkText) => {
  const link = screen.getByRole('link', { name: linkText });
  await userEvent.click(link);
};

/**
 * Helper function to fill in a form field by its label
 * @param {string} labelText - The text of the label for the field
 * @param {string} value - The value to enter into the field
 * @returns {Promise<void>}
 */
export const fillField = async (labelText, value) => {
  const field = screen.getByLabelText(labelText);
  await userEvent.clear(field);
  await userEvent.type(field, value);
};

/**
 * Helper function to select an option from a dropdown by its label
 * @param {string} labelText - The text of the label for the dropdown
 * @param {string} optionText - The text of the option to select
 * @returns {Promise<void>}
 */
export const selectOption = async (labelText, optionText) => {
  const dropdown = screen.getByLabelText(labelText);
  await userEvent.selectOptions(dropdown, optionText);
};

/**
 * Helper function to check a checkbox by its label
 * @param {string} labelText - The text of the label for the checkbox
 * @returns {Promise<void>}
 */
export const checkCheckbox = async (labelText) => {
  const checkbox = screen.getByLabelText(labelText);
  if (!checkbox.checked) {
    await userEvent.click(checkbox);
  }
};

/**
 * Helper function to uncheck a checkbox by its label
 * @param {string} labelText - The text of the label for the checkbox
 * @returns {Promise<void>}
 */
export const uncheckCheckbox = async (labelText) => {
  const checkbox = screen.getByLabelText(labelText);
  if (checkbox.checked) {
    await userEvent.click(checkbox);
  }
};

/**
 * Helper function to wait for an element to appear
 * @param {string} testId - The test ID of the element to wait for
 * @returns {Promise<HTMLElement>}
 */
export const waitForElement = async (testId) => {
  return await waitFor(() => screen.getByTestId(testId));
};

/**
 * Helper function to wait for an element to disappear
 * @param {string} testId - The test ID of the element to wait for
 * @returns {Promise<void>}
 */
export const waitForElementToDisappear = async (testId) => {
  return await waitFor(() => {
    expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
  });
};

/**
 * Helper function to wait for a loading indicator to disappear
 * @returns {Promise<void>}
 */
export const waitForLoadingToFinish = async () => {
  return await waitFor(() => {
    const loadingElement = document.querySelector('.loading-container');
    expect(loadingElement).not.toBeInTheDocument();
  });
};

/**
 * Helper function to simulate navigation to a route
 * @param {string} route - The route to navigate to
 * @returns {Promise<void>}
 */
export const navigateTo = async (route) => {
  // This assumes you're using React Router and have a link to the route
  const link = screen.getByRole('link', { name: new RegExp(route, 'i') });
  await userEvent.click(link);
};

/**
 * Helper function to submit a form
 * @param {string} submitButtonText - The text of the submit button
 * @returns {Promise<void>}
 */
export const submitForm = async (submitButtonText = 'Submit') => {
  const submitButton = screen.getByRole('button', { name: submitButtonText });
  await userEvent.click(submitButton);
};

export default {
  clickButton,
  clickLink,
  fillField,
  selectOption,
  checkCheckbox,
  uncheckCheckbox,
  waitForElement,
  waitForElementToDisappear,
  waitForLoadingToFinish,
  navigateTo,
  submitForm
};