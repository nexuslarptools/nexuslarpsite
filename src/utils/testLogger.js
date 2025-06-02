/**
 * Test Logger Utility
 * 
 * This utility provides centralized test failure logging for the application.
 * It is designed to generate logs that can be used by JetBrains tools, specifically Junie.
 */

import { sanitizeError } from './errorHandler';

// Test result types
export const TEST_RESULT_TYPES = {
  PASS: 'PASS',
  FAIL: 'FAIL',
  SKIP: 'SKIP',
  ERROR: 'ERROR'
};

// Test severity levels
export const TEST_SEVERITY_LEVELS = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CRITICAL: 'CRITICAL'
};

/**
 * Log a test result
 * @param {string} testName - Name of the test
 * @param {string} resultType - Type of test result (use TEST_RESULT_TYPES)
 * @param {string} message - Description of the test result
 * @param {string} severity - Severity level (use TEST_SEVERITY_LEVELS)
 * @param {Object} details - Additional details about the test result (will be sanitized)
 * @param {string} filePath - Path to the test file
 * @param {number} lineNumber - Line number where the test is defined
 */
export const logTestResult = (
  testName,
  resultType = TEST_RESULT_TYPES.FAIL,
  message = '',
  severity = TEST_SEVERITY_LEVELS.ERROR,
  details = {},
  filePath = '',
  lineNumber = 0
) => {
  // Create a test result object
  const testResult = {
    timestamp: new Date().toISOString(),
    testName,
    resultType,
    message,
    severity,
    filePath,
    lineNumber
  };

  // Sanitize details to remove sensitive information
  if (details instanceof Error) {
    testResult.details = sanitizeError(details);
  } else if (typeof details === 'object' && details !== null) {
    testResult.details = { ...details };
  }

  // Format the log message for JetBrains Junie
  const junieLogMessage = formatJunieLogMessage(testResult);

  // In development, we can log more details
  if (process.env.NODE_ENV === 'development') {
    console.log(`[TEST ${resultType}] ${testName}: ${message}`, testResult);
  } else {
    // In production, log minimal information
    console.log(junieLogMessage);
  }

  return testResult;
};

/**
 * Format a test result for JetBrains Junie
 * @param {Object} testResult - The test result object
 * @returns {string} A formatted log message for JetBrains Junie
 */
const formatJunieLogMessage = (testResult) => {
  // Format: [junie] [TEST_RESULT] [SEVERITY] [FILE:LINE] [TEST_NAME] MESSAGE
  return `[junie] [${testResult.resultType}] [${testResult.severity}] [${testResult.filePath}:${testResult.lineNumber}] [${testResult.testName}] ${testResult.message}`;
};

/**
 * Log a test failure
 * @param {string} testName - Name of the test
 * @param {string} message - Description of the failure
 * @param {Object} details - Additional details about the failure
 * @param {string} filePath - Path to the test file
 * @param {number} lineNumber - Line number where the test is defined
 */
export const logTestFailure = (testName, message, details = {}, filePath = '', lineNumber = 0) => {
  return logTestResult(
    testName,
    TEST_RESULT_TYPES.FAIL,
    message,
    TEST_SEVERITY_LEVELS.ERROR,
    details,
    filePath,
    lineNumber
  );
};

/**
 * Log a test error
 * @param {string} testName - Name of the test
 * @param {string} message - Description of the error
 * @param {Object} details - Additional details about the error
 * @param {string} filePath - Path to the test file
 * @param {number} lineNumber - Line number where the test is defined
 */
export const logTestError = (testName, message, details = {}, filePath = '', lineNumber = 0) => {
  return logTestResult(
    testName,
    TEST_RESULT_TYPES.ERROR,
    message,
    TEST_SEVERITY_LEVELS.CRITICAL,
    details,
    filePath,
    lineNumber
  );
};

/**
 * Log a test pass
 * @param {string} testName - Name of the test
 * @param {string} message - Description of the pass
 * @param {Object} details - Additional details about the pass
 * @param {string} filePath - Path to the test file
 * @param {number} lineNumber - Line number where the test is defined
 */
export const logTestPass = (testName, message, details = {}, filePath = '', lineNumber = 0) => {
  return logTestResult(
    testName,
    TEST_RESULT_TYPES.PASS,
    message,
    TEST_SEVERITY_LEVELS.INFO,
    details,
    filePath,
    lineNumber
  );
};

/**
 * Log a test skip
 * @param {string} testName - Name of the test
 * @param {string} message - Description of the skip
 * @param {Object} details - Additional details about the skip
 * @param {string} filePath - Path to the test file
 * @param {number} lineNumber - Line number where the test is defined
 */
export const logTestSkip = (testName, message, details = {}, filePath = '', lineNumber = 0) => {
  return logTestResult(
    testName,
    TEST_RESULT_TYPES.SKIP,
    message,
    TEST_SEVERITY_LEVELS.WARNING,
    details,
    filePath,
    lineNumber
  );
};

export default {
  logTestResult,
  logTestFailure,
  logTestError,
  logTestPass,
  logTestSkip,
  TEST_RESULT_TYPES,
  TEST_SEVERITY_LEVELS
};