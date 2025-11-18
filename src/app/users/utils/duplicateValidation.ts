// src/app/users/utils/duplicateValidation.ts
/**
 * Duplicate Validation Utilities
 * Reusable functions for checking duplicate usernames and emails
 */

import { Transaction } from 'sequelize';
import { Op } from 'sequelize';
import { ValidationError } from '../../../core/errors/index.js';
import { UserModel } from '../models/user.model.js';

/**
 * Normalize email to lowercase and trim whitespace
 * @param email - Email to normalize
 * @returns Normalized email
 */
export const normalizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

/**
 * Normalize username to lowercase and trim whitespace
 * @param username - Username to normalize
 * @returns Normalized username
 */
export const normalizeUsername = (username: string): string => {
  return username.trim().toLowerCase();
};

/**
 * Check if an email is already registered in the database
 *
 * @param email - Email to check
 * @param excludeUserId - Optional user ID to exclude from check (for updates)
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When email already exists
 *
 * @example
 * ```typescript
 * // Check for duplicate email (create scenario)
 * await checkDuplicateEmail('john@example.com');
 *
 * // Check for duplicate email excluding current user (update scenario)
 * await checkDuplicateEmail('john@example.com', 'user-123');
 *
 * // With transaction
 * await checkDuplicateEmail('john@example.com', undefined, transaction);
 * ```
 */
export const checkDuplicateEmail = async (
  email: string,
  excludeUserId?: string | number,
  transaction?: Transaction
): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);

  const whereClause: any = { email: normalizedEmail };

  // Exclude current user if updating
  if (excludeUserId !== undefined) {
    whereClause.userId = { [Op.ne]: excludeUserId };
  }

  const existingUser = await UserModel.findOne({
    where: whereClause,
    attributes: ['userId', 'email'],
    transaction,
  });

  if (existingUser) {
    throw new ValidationError(
      'Validation failed for User',
      `Email '${email}' is already registered${
        excludeUserId ? ' to another user' : ''
      }`
    );
  }
};

/**
 * Check if a username is already taken in the database
 *
 * @param username - Username to check
 * @param excludeUserId - Optional user ID to exclude from check (for updates)
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When username already exists
 *
 * @example
 * ```typescript
 * // Check for duplicate username (create scenario)
 * await checkDuplicateUsername('johndoe');
 *
 * // Check for duplicate username excluding current user (update scenario)
 * await checkDuplicateUsername('johndoe', 'user-123');
 *
 * // With transaction
 * await checkDuplicateUsername('johndoe', undefined, transaction);
 * ```
 */
export const checkDuplicateUsername = async (
  username: string,
  excludeUserId?: string | number,
  transaction?: Transaction
): Promise<void> => {
  const normalizedUsername = normalizeUsername(username);

  const whereClause: any = { username: normalizedUsername };

  // Exclude current user if updating
  if (excludeUserId !== undefined) {
    whereClause.userId = { [Op.ne]: excludeUserId };
  }

  const existingUser = await UserModel.findOne({
    where: whereClause,
    attributes: ['userId', 'username'],
    transaction,
  });

  if (existingUser) {
    throw new ValidationError(
      'Validation failed for User',
      `Username '${username}' is already taken${
        excludeUserId ? ' by another user' : ''
      }`
    );
  }
};

/**
 * Check if email and username are unique (for create operations)
 *
 * @param email - Email to check (optional)
 * @param username - Username to check (optional)
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When email or username already exists
 *
 * @example
 * ```typescript
 * // Check both email and username
 * await checkDuplicateFields({
 *   email: 'john@example.com',
 *   username: 'johndoe'
 * });
 *
 * // Check only email
 * await checkDuplicateFields({ email: 'john@example.com' });
 *
 * // With transaction
 * await checkDuplicateFields(
 *   { email: 'john@example.com', username: 'johndoe' },
 *   undefined,
 *   transaction
 * );
 * ```
 */
export const checkDuplicateFields = async (
  fields: { email?: string; username?: string },
  excludeUserId?: string | number,
  transaction?: Transaction
): Promise<void> => {
  // Check email if provided
  if (fields.email) {
    await checkDuplicateEmail(fields.email, excludeUserId, transaction);
  }

  // Check username if provided
  if (fields.username) {
    await checkDuplicateUsername(fields.username, excludeUserId, transaction);
  }
};

/**
 * Check for duplicate emails in bulk data
 *
 * @param emails - Array of emails to check
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When any email already exists in database
 *
 * @example
 * ```typescript
 * await checkBulkDuplicateEmails([
 *   'user1@example.com',
 *   'user2@example.com'
 * ]);
 * ```
 */
export const checkBulkDuplicateEmails = async (
  emails: string[],
  transaction?: Transaction
): Promise<void> => {
  if (emails.length === 0) return;

  const normalizedEmails = emails.map(normalizeEmail);

  const existingUsers = await UserModel.findAll({
    where: { email: normalizedEmails },
    attributes: ['email'],
    transaction,
  });

  if (existingUsers.length > 0) {
    const existingEmailList = existingUsers.map((user) => user.email);
    throw new ValidationError(
      'Validation failed for Users',
      `The following emails are already registered: ${existingEmailList.join(
        ', '
      )}`
    );
  }
};

/**
 * Check for duplicate usernames in bulk data
 *
 * @param usernames - Array of usernames to check
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When any username already exists in database
 *
 * @example
 * ```typescript
 * await checkBulkDuplicateUsernames(['user1', 'user2']);
 * ```
 */
export const checkBulkDuplicateUsernames = async (
  usernames: string[],
  transaction?: Transaction
): Promise<void> => {
  if (usernames.length === 0) return;

  const normalizedUsernames = usernames.map(normalizeUsername);

  const existingUsers = await UserModel.findAll({
    where: { username: normalizedUsernames },
    attributes: ['username'],
    transaction,
  });

  if (existingUsers.length > 0) {
    const existingUsernameList = existingUsers.map((user) => user.username);
    throw new ValidationError(
      'Validation failed for Users',
      `The following usernames are already taken: ${existingUsernameList.join(
        ', '
      )}`
    );
  }
};

/**
 * Check for duplicate values within an array
 *
 * @param values - Array of values to check
 * @param fieldName - Name of the field (for error message)
 * @throws {ValidationError} When duplicates are found
 *
 * @example
 * ```typescript
 * checkDuplicatesInArray(['email1@test.com', 'email1@test.com'], 'emails');
 * // Throws: "Duplicate emails in input: email1@test.com"
 * ```
 */
export const checkDuplicatesInArray = (
  values: string[],
  fieldName: string
): void => {
  const normalizedValues = values.map((v) =>
    fieldName === 'emails' ? normalizeEmail(v) : normalizeUsername(v)
  );

  const duplicates = normalizedValues.filter(
    (value, index) => normalizedValues.indexOf(value) !== index
  );

  if (duplicates.length > 0) {
    const uniqueDuplicates = [...new Set(duplicates)];
    throw new ValidationError(
      'Validation failed for Users',
      `Duplicate ${fieldName} in input: ${uniqueDuplicates.join(', ')}`
    );
  }
};

/**
 * Validate bulk data for duplicates within array and against database
 *
 * @param data - Array of user data
 * @param transaction - Optional transaction object
 * @throws {ValidationError} When duplicates are found
 *
 * @example
 * ```typescript
 * await validateBulkUserData([
 *   { username: 'user1', email: 'user1@example.com' },
 *   { username: 'user2', email: 'user2@example.com' }
 * ]);
 * ```
 */
export const validateBulkUserData = async (
  data: Array<{ email?: string; username?: string }>,
  transaction?: Transaction
): Promise<void> => {
  // Extract and filter emails and usernames
  const emails = data
    .map((user) => user.email)
    .filter((email): email is string => !!email);

  const usernames = data
    .map((user) => user.username)
    .filter((username): username is string => !!username);

  // Check for duplicates within input array
  if (emails.length > 0) {
    checkDuplicatesInArray(emails, 'emails');
  }

  if (usernames.length > 0) {
    checkDuplicatesInArray(usernames, 'usernames');
  }

  // Check for duplicates in database
  await checkBulkDuplicateEmails(emails, transaction);
  await checkBulkDuplicateUsernames(usernames, transaction);
};

/**
 * Check if user's email or username should be validated
 * (only validates if the field is actually changing)
 *
 * @param currentValue - Current field value
 * @param newValue - New field value
 * @returns True if validation should be performed
 *
 * @example
 * ```typescript
 * const shouldValidate = shouldValidateField('john@example.com', 'jane@example.com');
 * // Returns: true (value is changing)
 *
 * const shouldValidate = shouldValidateField('john@example.com', 'john@example.com');
 * // Returns: false (value is not changing)
 * ```
 */
export const shouldValidateField = (
  currentValue: string,
  newValue: string
): boolean => {
  return currentValue !== newValue;
};
