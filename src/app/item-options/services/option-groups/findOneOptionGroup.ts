/**
 * Find One Option Group Service
 * Retrieves a single option group matching the filter
 */

import { OptionGroupModel } from '../../models/option-group.model.js';
import { IOptionGroupDocument } from '../../interfaces/option-group.interface.js';
import { ApiResponse } from '../../../../core/utils/mongooseCrudServiceGenerator.js';
import { NotFoundError } from '../../../../core/errors/index.js';
import { FilterQuery } from 'mongoose';

/**
 * Retrieves a single option group matching the filter
 *
 * @param filter - The filter query
 * @returns ApiResponse with the option group
 * @throws {NotFoundError} When option group not found
 *
 * @example
 * ```typescript
 * const result = await findOneOptionGroup({ optionId: 'size-options' });
 * ```
 */
export async function findOneOptionGroup(
  filter: FilterQuery<IOptionGroupDocument>
): Promise<ApiResponse<IOptionGroupDocument>> {
  const optionGroup = await OptionGroupModel.findOne(filter);

  if (!optionGroup) {
    throw new NotFoundError('Option group not found');
  }

  return {
    success: true,
    data: optionGroup,
    message: 'Option group found successfully',
  };
}
