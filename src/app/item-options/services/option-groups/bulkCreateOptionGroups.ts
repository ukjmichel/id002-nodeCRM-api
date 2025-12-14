/**
 * Bulk Create Option Groups Service
 * Creates multiple option groups at once
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import {
  IOptionGroupDocument,
  CreateOptionGroupInput,
} from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { ValidationError } from '../../../../core/errors/index.js';

/**
 * Result of bulk create operation
 */
export interface BulkCreateResult {
  created: IOptionGroupDocument[];
  failed: Array<{
    data: CreateOptionGroupInput;
    error: string;
  }>;
}

/**
 * Creates multiple option groups at once
 *
 * @param optionGroups - Array of option group data
 * @returns ApiResponse with created option groups and any failures
 * @throws {ValidationError} When input is invalid or all creations fail
 *
 * @example
 * ```typescript
 * const result = await bulkCreateOptionGroups([
 *   { optionId: 'size-options', description: 'Size options' },
 *   { optionId: 'topping-options', description: 'Topping options' }
 * ]);
 * ```
 */
export async function bulkCreateOptionGroups(
  optionGroups: CreateOptionGroupInput[]
): Promise<ApiResponse<BulkCreateResult>> {
  if (!Array.isArray(optionGroups) || optionGroups.length === 0) {
    throw new ValidationError(
      'Invalid input',
      'Option groups array is required and must not be empty'
    );
  }

  const created: IOptionGroupDocument[] = [];
  const failed: Array<{ data: CreateOptionGroupInput; error: string }> = [];

  // Check for duplicate optionIds in the input
  const optionIds = optionGroups.map((og) => og.optionId);
  const duplicateIds = optionIds.filter(
    (id, index) => optionIds.indexOf(id) !== index
  );

  if (duplicateIds.length > 0) {
    throw new ValidationError(
      'Duplicate input',
      `Duplicate optionIds in input: ${[...new Set(duplicateIds)].join(', ')}`
    );
  }

  // Check for existing optionIds in database
  const existingGroups = await OptionGroupModel.find({
    optionId: { $in: optionIds },
  });
  const existingOptionIds = new Set(existingGroups.map((og) => og.optionId));

  // Process each option group
  for (const data of optionGroups) {
    if (existingOptionIds.has(data.optionId)) {
      failed.push({
        data,
        error: `Option group with optionId '${data.optionId}' already exists`,
      });
      continue;
    }

    try {
      const optionGroup = await OptionGroupModel.create({
        optionId: data.optionId,
        description: data.description,
        items: data.items || [],
      });
      created.push(optionGroup);
    } catch (error) {
      const err = error as Error;
      failed.push({
        data,
        error: err.message,
      });
    }
  }

  const allFailed = created.length === 0;

  if (allFailed) {
    throw new ValidationError(
      'Bulk create failed',
      'Failed to create any option groups'
    );
  }

  return {
    success: true,
    data: { created, failed },
    message:
      failed.length === 0
        ? `Successfully created ${created.length} option groups`
        : `Created ${created.length} option groups, ${failed.length} failed`,
  };
}
