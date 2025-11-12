import {
  Model,
  ModelStatic,
  WhereOptions,
  Order,
  Includeable,
  FindOptions,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  CountOptions,
  BulkCreateOptions,
  Attributes,
} from 'sequelize';
import { NotFoundError, ValidationError } from '../errors/';

/**
 * Standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  count?: number;
  message: string;
}

/**
 * Options for findAll operation
 */
export interface FindAllOptions<T extends Model> {
  where?: WhereOptions<Attributes<T>>;
  limit?: number;
  offset?: number;
  order?: Order;
  include?: Includeable | Includeable[];
}

/**
 * Options for findOne/findById operations
 */
export interface FindOneOptions {
  include?: Includeable | Includeable[];
}

/**
 * CRUD Service Interface
 * Defines all available operations for a CRUD service
 */
export interface ICrudService<T extends Model> {
  create(
    data: Partial<Attributes<T>>,
    options?: CreateOptions
  ): Promise<ApiResponse<T>>;

  findAll(options?: FindAllOptions<T>): Promise<ApiResponse<T[]>>;

  findById(
    id: number | string,
    options?: FindOneOptions
  ): Promise<ApiResponse<T>>;

  findOne(
    where: WhereOptions<Attributes<T>>,
    options?: FindOneOptions
  ): Promise<ApiResponse<T>>;

  update(
    id: number | string,
    data: Partial<Attributes<T>>,
    options?: UpdateOptions
  ): Promise<ApiResponse<T>>;

  delete(
    id: number | string,
    options?: DestroyOptions
  ): Promise<ApiResponse<void>>;

  bulkCreate(
    dataArray: Partial<Attributes<T>>[],
    options?: BulkCreateOptions
  ): Promise<ApiResponse<T[]>>;

  count(
    where?: WhereOptions<Attributes<T>>,
    options?: CountOptions
  ): Promise<ApiResponse<number>>;
}

/**
 * Generic CRUD Service Generator
 * Creates standard CRUD operations for any Sequelize model
 *
 * @template T - The Sequelize Model type
 * @param model - Sequelize model class
 * @param modelName - Name of the model (for error messages)
 * @returns Service object with CRUD operations
 *
 * @example
 * ```typescript
 * import { User } from '../models/User';
 * const userService = createCrudService(User, 'User');
 *
 * // Use the service
 * const result = await userService.create({ name: 'John', email: 'john@example.com' });
 * ```
 */
const createCrudService = <T extends Model>(
  model: ModelStatic<T>,
  modelName: string = 'Resource'
): ICrudService<T> => {
  return {
    /**
     * Create a new record
     * @param data - Data to create the record
     * @param options - Sequelize create options
     * @returns Created record wrapped in ApiResponse
     * @throws {ValidationError} When validation fails
     */
    create: async (
      data: Partial<Attributes<T>>,
      options?: CreateOptions
    ): Promise<ApiResponse<T>> => {
      try {
        const record = await model.create(data as any, options);
        return {
          success: true,
          data: record,
          message: `${modelName} created successfully`,
        };
      } catch (error) {
        // Handle Sequelize validation errors
        if (
          error instanceof Error &&
          error.name === 'SequelizeValidationError'
        ) {
          throw new ValidationError(
            `Validation failed for ${modelName}`,
            error.message
          );
        }
        throw new ValidationError(
          `Error creating ${modelName}`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },

    /**
     * Get all records with optional filters and pagination
     * @param options - Query options (where, limit, offset, order, include)
     * @returns Array of records with count
     * @throws {ValidationError} When query options are invalid
     */
    findAll: async (
      options: FindAllOptions<T> = {}
    ): Promise<ApiResponse<T[]>> => {
      try {
        const { where, limit, offset, order, include } = options;

        const queryOptions: FindOptions<Attributes<T>> = {
          ...(where && { where }),
          ...(limit && { limit }),
          ...(offset && { offset }),
          ...(order && { order }),
          ...(include && { include }),
        };

        const records = await model.findAll(queryOptions);
        const count = await model.count({ where: where || {} });

        return {
          success: true,
          data: records,
          count,
          message: `${modelName}s retrieved successfully`,
        };
      } catch (error) {
        throw new ValidationError(
          `Error fetching ${modelName}s`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },

    /**
     * Get a single record by ID
     * @param id - Record ID
     * @param options - Query options (include)
     * @returns Single record
     * @throws {NotFoundError} When record is not found
     * @throws {ValidationError} When query fails
     */
    findById: async (
      id: number | string,
      options: FindOneOptions = {}
    ): Promise<ApiResponse<T>> => {
      try {
        const { include } = options;

        // Use findByPk which is type-safe for id lookup
        const record = await model.findByPk(id, {
          ...(include && { include }),
        });

        if (!record) {
          throw new NotFoundError(`${modelName} with ID ${id} not found`);
        }

        return {
          success: true,
          data: record,
          message: `${modelName} retrieved successfully`,
        };
      } catch (error) {
        // Re-throw NotFoundError as-is
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new ValidationError(
          `Error fetching ${modelName}`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },

    /**
     * Find one record by criteria
     * @param where - Where clause
     * @param options - Query options (include)
     * @returns Single record
     * @throws {NotFoundError} When record is not found
     * @throws {ValidationError} When query fails
     */
    findOne: async (
      where: WhereOptions<Attributes<T>>,
      options: FindOneOptions = {}
    ): Promise<ApiResponse<T>> => {
      try {
        const { include } = options;

        const queryOptions: FindOptions<Attributes<T>> = {
          where,
          ...(include && { include }),
        };

        const record = await model.findOne(queryOptions);

        if (!record) {
          throw new NotFoundError(`${modelName} not found`);
        }

        return {
          success: true,
          data: record,
          message: `${modelName} retrieved successfully`,
        };
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new ValidationError(
          `Error fetching ${modelName}`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },

    /**
     * Update a record by ID
     * @param id - Record ID
     * @param data - Data to update
     * @param options - Sequelize update options
     * @returns Updated record
     * @throws {NotFoundError} When record is not found
     * @throws {ValidationError} When update fails
     */
    update: async (
      id: number | string,
      data: Partial<Attributes<T>>,
      options?: UpdateOptions
    ): Promise<ApiResponse<T>> => {
      try {
        const record = await model.findByPk(id);

        if (!record) {
          throw new NotFoundError(`${modelName} with ID ${id} not found`);
        }

        await record.update(data as any, options);

        return {
          success: true,
          data: record,
          message: `${modelName} updated successfully`,
        };
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        if (
          error instanceof Error &&
          error.name === 'SequelizeValidationError'
        ) {
          throw new ValidationError(
            `Validation failed for ${modelName}`,
            error.message
          );
        }
        throw new ValidationError(
          `Error updating ${modelName}`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },

    /**
     * Delete a record by ID
     * @param id - Record ID
     * @param options - Sequelize destroy options
     * @returns Deletion confirmation
     * @throws {NotFoundError} When record is not found
     * @throws {ValidationError} When deletion fails
     */
    delete: async (
      id: number | string,
      options?: DestroyOptions
    ): Promise<ApiResponse<void>> => {
      try {
        const record = await model.findByPk(id);

        if (!record) {
          throw new NotFoundError(`${modelName} with ID ${id} not found`);
        }

        await record.destroy(options);

        return {
          success: true,
          message: `${modelName} deleted successfully`,
        };
      } catch (error) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new ValidationError(
          `Error deleting ${modelName}`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },

    /**
     * Bulk create records
     * @param dataArray - Array of data to create
     * @param options - Sequelize bulk create options
     * @returns Created records
     * @throws {ValidationError} When bulk creation fails
     */
    bulkCreate: async (
      dataArray: Partial<Attributes<T>>[],
      options?: BulkCreateOptions
    ): Promise<ApiResponse<T[]>> => {
      try {
        const records = await model.bulkCreate(dataArray as any[], options);
        return {
          success: true,
          data: records,
          message: `${modelName}s created successfully`,
        };
      } catch (error) {
        if (
          error instanceof Error &&
          error.name === 'SequelizeValidationError'
        ) {
          throw new ValidationError(
            `Validation failed for ${modelName}s`,
            error.message
          );
        }
        throw new ValidationError(
          `Error bulk creating ${modelName}s`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },

    /**
     * Count records with optional filters
     * @param where - Where clause
     * @param options - Sequelize count options
     * @returns Count result
     * @throws {ValidationError} When count fails
     */
    count: async (
      where: WhereOptions<Attributes<T>> = {},
      options?: CountOptions
    ): Promise<ApiResponse<number>> => {
      try {
        const count = await model.count({
          where,
          ...options,
        });
        return {
          success: true,
          data: count,
          count,
          message: `${modelName}s counted successfully`,
        };
      } catch (error) {
        throw new ValidationError(
          `Error counting ${modelName}s`,
          error instanceof Error ? error.message : String(error)
        );
      }
    },
  };
};

export default createCrudService;
