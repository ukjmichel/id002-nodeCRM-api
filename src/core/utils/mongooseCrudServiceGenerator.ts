// src/utils/mongooseCrudServiceGenerator.ts
/**
 * Generic CRUD Service Generator for Mongoose Models
 * Creates standard CRUD operations for any Mongoose model
 */

import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from 'mongoose';
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
export interface FindAllOptions<T = any> {
  filter?: FilterQuery<T>;
  limit?: number;
  skip?: number;
  sort?: any;
  populate?: string | string[] | any;
  select?: string | any;
}

/**
 * Options for findOne/findById operations
 */
export interface FindOneOptions {
  populate?: string | string[] | any;
  select?: string | any;
}

/**
 * CRUD Service Interface for Mongoose
 * Defines all available operations for a CRUD service
 */
export interface IMongooseCrudService<T> {
  create(data: Partial<T>): Promise<ApiResponse<T & Document>>;

  findAll(options?: FindAllOptions<T>): Promise<ApiResponse<(T & Document)[]>>;

  findById(
    id: string,
    options?: FindOneOptions
  ): Promise<ApiResponse<T & Document>>;

  findOne(
    filter: FilterQuery<T>,
    options?: FindOneOptions
  ): Promise<ApiResponse<T & Document>>;

  update(
    id: string,
    data: UpdateQuery<T>,
    options?: QueryOptions
  ): Promise<ApiResponse<T & Document>>;

  delete(id: string, options?: QueryOptions): Promise<ApiResponse<void>>;

  bulkCreate(dataArray: Partial<T>[]): Promise<ApiResponse<(T & Document)[]>>;

  count(filter?: FilterQuery<T>): Promise<ApiResponse<number>>;
}

/**
 * Generic CRUD Service Generator for Mongoose
 * Creates standard CRUD operations for any Mongoose model
 *
 * @template T - The Mongoose Document type
 * @param model - Mongoose model
 * @param modelName - Name of the model (for error messages)
 * @returns Service object with CRUD operations
 *
 * @example
 * ```typescript
 * import { BusinessItemOptionGroupModel } from '../models/business-item-option-group.model';
 * const optionGroupService = createMongooseCrudService(
 *   BusinessItemOptionGroupModel,
 *   'BusinessItemOptionGroup'
 * );
 *
 * // Use the service
 * const result = await optionGroupService.create({
 *   optionId: 'size-opt-001',
 *   description: 'Size options',
 *   items: []
 * });
 * ```
 */
const createMongooseCrudService = <T>(
  model: Model<T>,
  modelName: string = 'Resource'
): IMongooseCrudService<T> => {
  return {
    /**
     * Create a new document
     * @param data - Data to create the document
     * @returns Created document wrapped in ApiResponse
     * @throws {ValidationError} When validation fails
     */
    create: async (data: Partial<T>): Promise<ApiResponse<T & Document>> => {
      try {
        const document = await model.create(data);
        return {
          success: true,
          data: document as unknown as T & Document,
          message: `${modelName} created successfully`,
        };
      } catch (error: any) {
        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors)
            .map((err: any) => err.message)
            .join(', ');
          throw new ValidationError(
            `Validation failed for ${modelName}`,
            messages
          );
        }
        // Handle duplicate key errors
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern || {})[0] || 'field';
          throw new ValidationError(
            `Duplicate ${modelName}`,
            `A ${modelName} with this ${field} already exists`
          );
        }
        throw new ValidationError(
          `Error creating ${modelName}`,
          error.message || String(error)
        );
      }
    },

    /**
     * Get all documents with optional filters and pagination
     * @param options - Query options (filter, limit, skip, sort, populate, select)
     * @returns Array of documents with count
     * @throws {ValidationError} When query options are invalid
     */
    findAll: async (
      options: FindAllOptions<T> = {}
    ): Promise<ApiResponse<(T & Document)[]>> => {
      try {
        const { filter = {}, limit, skip, sort, populate, select } = options;

        let query = model.find(filter);

        if (limit) query = query.limit(limit);
        if (skip) query = query.skip(skip);
        if (sort) query = query.sort(sort);
        if (populate) query = query.populate(populate);
        if (select) query = query.select(select);

        const documents = await query.exec();
        const count = await model.countDocuments(filter);

        return {
          success: true,
          data: documents as unknown as (T & Document)[],
          count,
          message: `${modelName}s retrieved successfully`,
        };
      } catch (error: any) {
        throw new ValidationError(
          `Error fetching ${modelName}s`,
          error.message || String(error)
        );
      }
    },

    /**
     * Get a single document by ID
     * @param id - Document ID
     * @param options - Query options (populate, select)
     * @returns Single document
     * @throws {NotFoundError} When document is not found
     * @throws {ValidationError} When query fails
     */
    findById: async (
      id: string,
      options: FindOneOptions = {}
    ): Promise<ApiResponse<T & Document>> => {
      try {
        const { populate, select } = options;

        let query = model.findById(id);

        if (populate) query = query.populate(populate);
        if (select) query = query.select(select);

        const document = await query.exec();

        if (!document) {
          throw new NotFoundError(`${modelName} with ID ${id} not found`);
        }

        return {
          success: true,
          data: document as unknown as T & Document,
          message: `${modelName} retrieved successfully`,
        };
      } catch (error: any) {
        // Re-throw NotFoundError as-is
        if (error instanceof NotFoundError) {
          throw error;
        }
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
          throw new ValidationError(
            `Invalid ${modelName} ID format`,
            error.message
          );
        }
        throw new ValidationError(
          `Error fetching ${modelName}`,
          error.message || String(error)
        );
      }
    },

    /**
     * Find one document by criteria
     * @param filter - Filter query
     * @param options - Query options (populate, select)
     * @returns Single document
     * @throws {NotFoundError} When document is not found
     * @throws {ValidationError} When query fails
     */
    findOne: async (
      filter: FilterQuery<T>,
      options: FindOneOptions = {}
    ): Promise<ApiResponse<T & Document>> => {
      try {
        const { populate, select } = options;

        let query = model.findOne(filter);

        if (populate) query = query.populate(populate);
        if (select) query = query.select(select);

        const document = await query.exec();

        if (!document) {
          throw new NotFoundError(`${modelName} not found`);
        }

        return {
          success: true,
          data: document as unknown as T & Document,
          message: `${modelName} retrieved successfully`,
        };
      } catch (error: any) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        throw new ValidationError(
          `Error fetching ${modelName}`,
          error.message || String(error)
        );
      }
    },

    /**
     * Update a document by ID
     * @param id - Document ID
     * @param data - Data to update
     * @param options - Mongoose update options
     * @returns Updated document
     * @throws {NotFoundError} When document is not found
     * @throws {ValidationError} When update fails
     */
    update: async (
      id: string,
      data: UpdateQuery<T>,
      options: QueryOptions = {}
    ): Promise<ApiResponse<T & Document>> => {
      try {
        const document = await model.findByIdAndUpdate(id, data, {
          new: true, // Return the updated document
          runValidators: true, // Run model validators
          ...options,
        });

        if (!document) {
          throw new NotFoundError(`${modelName} with ID ${id} not found`);
        }

        return {
          success: true,
          data: document as unknown as T & Document,
          message: `${modelName} updated successfully`,
        };
      } catch (error: any) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors)
            .map((err: any) => err.message)
            .join(', ');
          throw new ValidationError(
            `Validation failed for ${modelName}`,
            messages
          );
        }
        if (error.code === 11000) {
          const field = Object.keys(error.keyPattern || {})[0] || 'field';
          throw new ValidationError(
            `Duplicate ${modelName}`,
            `A ${modelName} with this ${field} already exists`
          );
        }
        if (error.name === 'CastError') {
          throw new ValidationError(
            `Invalid ${modelName} ID format`,
            error.message
          );
        }
        throw new ValidationError(
          `Error updating ${modelName}`,
          error.message || String(error)
        );
      }
    },

    /**
     * Delete a document by ID
     * @param id - Document ID
     * @param options - Mongoose delete options
     * @returns Deletion confirmation
     * @throws {NotFoundError} When document is not found
     * @throws {ValidationError} When deletion fails
     */
    delete: async (
      id: string,
      options: QueryOptions = {}
    ): Promise<ApiResponse<void>> => {
      try {
        const document = await model.findByIdAndDelete(id, options);

        if (!document) {
          throw new NotFoundError(`${modelName} with ID ${id} not found`);
        }

        return {
          success: true,
          message: `${modelName} deleted successfully`,
        };
      } catch (error: any) {
        if (error instanceof NotFoundError) {
          throw error;
        }
        if (error.name === 'CastError') {
          throw new ValidationError(
            `Invalid ${modelName} ID format`,
            error.message
          );
        }
        throw new ValidationError(
          `Error deleting ${modelName}`,
          error.message || String(error)
        );
      }
    },

    /**
     * Bulk create documents
     * @param dataArray - Array of data to create
     * @returns Created documents
     * @throws {ValidationError} When bulk creation fails
     */
    bulkCreate: async (
      dataArray: Partial<T>[]
    ): Promise<ApiResponse<(T & Document)[]>> => {
      try {
        const documents = await model.insertMany(dataArray, {
          ordered: false, // Continue on error
        });
        return {
          success: true,
          data: documents as unknown as (T & Document)[],
          message: `${modelName}s created successfully`,
        };
      } catch (error: any) {
        if (error.name === 'ValidationError') {
          const messages = Object.values(error.errors)
            .map((err: any) => err.message)
            .join(', ');
          throw new ValidationError(
            `Validation failed for ${modelName}s`,
            messages
          );
        }
        if (error.code === 11000) {
          throw new ValidationError(
            `Duplicate ${modelName}s`,
            'One or more documents have duplicate unique fields'
          );
        }
        throw new ValidationError(
          `Error bulk creating ${modelName}s`,
          error.message || String(error)
        );
      }
    },

    /**
     * Count documents with optional filters
     * @param filter - Filter query
     * @returns Count result
     * @throws {ValidationError} When count fails
     */
    count: async (
      filter: FilterQuery<T> = {}
    ): Promise<ApiResponse<number>> => {
      try {
        const count = await model.countDocuments(filter);
        return {
          success: true,
          data: count,
          count,
          message: `${modelName}s counted successfully`,
        };
      } catch (error: any) {
        throw new ValidationError(
          `Error counting ${modelName}s`,
          error.message || String(error)
        );
      }
    },
  };
};

export default createMongooseCrudService;
