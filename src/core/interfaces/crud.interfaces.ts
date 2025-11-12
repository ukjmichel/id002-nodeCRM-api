import {
  Model,
  WhereOptions,
  Order,
  Includeable,
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  CountOptions,
  BulkCreateOptions,
  Attributes,
  FindOptions,
} from 'sequelize';

// Re-export Sequelize types that are used in the interface
export type {
  CreateOptions,
  UpdateOptions,
  DestroyOptions,
  CountOptions,
  BulkCreateOptions,
  WhereOptions,
  Attributes,
  Order,
  Includeable,
  FindOptions,
};

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
  /**
   * Create a new record
   * @param data - Data to create the record
   * @param options - Sequelize create options
   * @returns Created record wrapped in ApiResponse
   */
  create(
    data: Partial<Attributes<T>>,
    options?: CreateOptions
  ): Promise<ApiResponse<T>>;

  /**
   * Get all records with optional filters and pagination
   * @param options - Query options (where, limit, offset, order, include)
   * @returns Array of records with count
   */
  findAll(options?: FindAllOptions<T>): Promise<ApiResponse<T[]>>;

  /**
   * Get a single record by ID
   * @param id - Record ID
   * @param options - Query options (include)
   * @returns Single record
   */
  findById(
    id: number | string,
    options?: FindOneOptions
  ): Promise<ApiResponse<T>>;

  /**
   * Find one record by criteria
   * @param where - Where clause
   * @param options - Query options (include)
   * @returns Single record
   */
  findOne(
    where: WhereOptions<Attributes<T>>,
    options?: FindOneOptions
  ): Promise<ApiResponse<T>>;

  /**
   * Update a record by ID
   * @param id - Record ID
   * @param data - Data to update
   * @param options - Sequelize update options
   * @returns Updated record
   */
  update(
    id: number | string,
    data: Partial<Attributes<T>>,
    options?: UpdateOptions
  ): Promise<ApiResponse<T>>;

  /**
   * Delete a record by ID
   * @param id - Record ID
   * @param options - Sequelize destroy options
   * @returns Deletion confirmation
   */
  delete(
    id: number | string,
    options?: DestroyOptions
  ): Promise<ApiResponse<void>>;

  /**
   * Bulk create records
   * @param dataArray - Array of data to create
   * @param options - Sequelize bulk create options
   * @returns Created records
   */
  bulkCreate(
    dataArray: Partial<Attributes<T>>[],
    options?: BulkCreateOptions
  ): Promise<ApiResponse<T[]>>;

  /**
   * Count records with optional filters
   * @param where - Where clause
   * @param options - Sequelize count options
   * @returns Count result
   */
  count(
    where?: WhereOptions<Attributes<T>>,
    options?: CountOptions
  ): Promise<ApiResponse<number>>;
}
