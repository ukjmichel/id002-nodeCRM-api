/**
 * Find One Business Service
 * Finds a single business by criteria
 */

import { NotFoundError, ValidationError } from '../../../core/errors/index.js';
import {
  ApiResponse,
  Attributes,
  FindOneOptions,
  FindOptions,
  WhereOptions,
} from '../../../core/interfaces/index.js';
import { BusinessModel } from '../models/business.model.js';

/**
 * Find one business by criteria
 *
 * @param where - Where clause
 * @param options - Query options (include)
 * @returns Single business record
 * @throws {NotFoundError} When business is not found
 * @throws {ValidationError} When query fails
 *
 * @example
 * ```typescript
 * const business = await findOneBusiness({ siret: '12345678901234' });
 * ```
 */
export const findOneBusiness = async (
  where: WhereOptions<Attributes<BusinessModel>>,
  options: FindOneOptions = {}
): Promise<ApiResponse<BusinessModel>> => {
  try {
    const { include } = options;

    const queryOptions: FindOptions<Attributes<BusinessModel>> = {
      where,
      ...(include && { include }),
    };

    const record = await BusinessModel.findOne(queryOptions);

    if (!record) {
      throw new NotFoundError('Business not found');
    }

    return {
      success: true,
      data: record,
      message: 'Business retrieved successfully',
    };
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    throw new ValidationError(
      'Error fetching Business',
      error instanceof Error ? error.message : String(error)
    );
  }
};
