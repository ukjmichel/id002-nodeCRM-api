// src/models/item.model.ts
/**
 * =============================================================================
 * ItemModel – Sequelize (sequelize-typescript)
 * =============================================================================
 * Stores information about items/products sold by businesses, including:
 * - Basic product information (name, description, type, price)
 * - Dietary information (halal, vegan, vegetarian, gluten-free, etc.)
 * - Allergen information
 * - Availability and stock management
 * - Nutritional information (optional)
 * =============================================================================
 */

import {
  Column,
  Model,
  Table,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  Index,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BusinessModel } from '../../businesses/models/business.model.js';
import {
  ItemAttributes,
  ItemCreationAttributes,
} from '../interfaces/item.interface.js';

// =========================================================================
// Enums
// =========================================================================

export enum ItemType {
  FOOD = 'food',
  DRINK = 'drink',
  DESSERT = 'dessert',
  APPETIZER = 'appetizer',
  MAIN_COURSE = 'main_course',
  SIDE_DISH = 'side_dish',
  SNACK = 'snack',
  COMBO = 'combo',
  SAUCE = 'sauce',
  SUPPLEMENT = 'supplement',
  OTHER = 'other',
}

export enum ItemCategory {
  MEAT = 'meat',
  POULTRY = 'poultry',
  SEAFOOD = 'seafood',
  VEGETABLE = 'vegetable',
  DAIRY = 'dairy',
  BAKERY = 'bakery',
  BEVERAGE = 'beverage',
  FROZEN = 'frozen',
  PREPARED = 'prepared',
  CONDIMENT = 'condiment',
  OTHER = 'other',
}

export enum SpicyLevel {
  NONE = 'none',
  MILD = 'mild',
  MEDIUM = 'medium',
  HOT = 'hot',
  EXTRA_HOT = 'extra_hot',
}

@Table({
  tableName: 'items',
  timestamps: true,
  indexes: [
    { name: 'idx_items_business_id', fields: ['businessId'] },
    { name: 'idx_items_type', fields: ['type'] },
    { name: 'idx_items_category', fields: ['category'] },
    { name: 'idx_items_available', fields: ['available'] },
    { name: 'idx_items_featured', fields: ['featured'] },
    { name: 'idx_items_price', fields: ['price'] },
    { name: 'idx_items_halal', fields: ['isHalal'] },
    { name: 'idx_items_vegan', fields: ['isVegan'] },
    { name: 'idx_items_vegetarian', fields: ['isVegetarian'] },
    { name: 'idx_items_gluten_free', fields: ['isGlutenFree'] },
    {
      name: 'idx_items_name',
      fields: ['businessId', 'name'],
      unique: true,
    },
    { name: 'idx_items_sku', fields: ['sku'] },
    { name: 'idx_items_barcode', fields: ['barcode'] },
  ],
})
export class ItemModel
  extends Model<ItemAttributes, ItemCreationAttributes>
  implements ItemAttributes
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true,
  })
  declare itemId: string;

  @ForeignKey(() => BusinessModel)
  @Index('idx_items_business_id')
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare businessId: string;

  @BelongsTo(() => BusinessModel)
  declare business: BusinessModel;

  // =========================================================================
  // Basic Information
  // =========================================================================

  @Column({
    type: DataType.STRING(191),
    allowNull: false,
    validate: {
      len: {
        args: [2, 191],
        msg: 'Item name must be between 2 and 191 characters',
      },
    },
  })
  declare name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    validate: {
      len: {
        args: [0, 255],
        msg: 'Short description must not exceed 255 characters',
      },
    },
  })
  declare shortDescription?: string;

  @Index('idx_items_type')
  @Column({
    type: DataType.ENUM(...Object.values(ItemType)),
    allowNull: false,
    defaultValue: ItemType.OTHER,
  })
  declare type: ItemType;

  @Index('idx_items_category')
  @Column({
    type: DataType.ENUM(...Object.values(ItemCategory)),
    allowNull: true,
  })
  declare category?: ItemCategory;

  // =========================================================================
  // Pricing
  // =========================================================================

  @Index('idx_items_price')
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Price must be a positive number',
      },
    },
  })
  declare price: number;

  @Column({
    type: DataType.STRING(3),
    allowNull: false,
    defaultValue: 'EUR',
    validate: {
      isIn: {
        args: [['EUR', 'USD', 'GBP', 'CHF']],
        msg: 'Invalid currency code',
      },
    },
  })
  declare currency: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Discount price must be a positive number',
      },
    },
  })
  declare discountPrice?: number;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare discountStartDate?: Date;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare discountEndDate?: Date;

  // =========================================================================
  // Dietary Information
  // =========================================================================

  @Index('idx_items_halal')
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isHalal: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isKosher: boolean;

  @Index('idx_items_vegan')
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isVegan: boolean;

  @Index('idx_items_vegetarian')
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isVegetarian: boolean;

  @Index('idx_items_gluten_free')
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isGlutenFree: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isLactoseFree: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isOrganic: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isBio: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isHomemade: boolean;

  // =========================================================================
  // Allergen Information
  // =========================================================================

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsNuts: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsPeanuts: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsSoy: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsEggs: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsFish: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsShellfish: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsWheat: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsMilk: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsSesame: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare containsSulfites: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare allergenNotes?: string;

  // =========================================================================
  // Taste & Preparation
  // =========================================================================

  @Column({
    type: DataType.ENUM(...Object.values(SpicyLevel)),
    allowNull: false,
    defaultValue: SpicyLevel.NONE,
  })
  declare spicyLevel: SpicyLevel;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isRaw: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare isCooked: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isFried: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isGrilled: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare isSteamed: boolean;

  // =========================================================================
  // Nutritional Information (per serving)
  // =========================================================================

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare servingSize?: string;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Calories must be a positive number',
      },
    },
  })
  declare calories?: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Protein must be a positive number',
      },
    },
  })
  declare protein?: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Carbohydrates must be a positive number',
      },
    },
  })
  declare carbohydrates?: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Fat must be a positive number',
      },
    },
  })
  declare fat?: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Fiber must be a positive number',
      },
    },
  })
  declare fiber?: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Sugar must be a positive number',
      },
    },
  })
  declare sugar?: number;

  @Column({
    type: DataType.DECIMAL(8, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Sodium must be a positive number',
      },
    },
  })
  declare sodium?: number;

  // =========================================================================
  // Availability
  // =========================================================================

  @Index('idx_items_available')
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare available: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare availableForDelivery: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare availableForPickup: boolean;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare availableForDineIn: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Stock quantity must be a positive number',
      },
    },
  })
  declare stockQuantity?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Low stock threshold must be a positive number',
      },
    },
  })
  declare lowStockThreshold?: number;

  // =========================================================================
  // Ordering
  // =========================================================================

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Preparation time must be a positive number',
      },
    },
  })
  declare preparationTime?: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'Minimum order quantity must be at least 1',
      },
    },
  })
  declare minOrderQuantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    validate: {
      min: {
        args: [1],
        msg: 'Maximum order quantity must be at least 1',
      },
    },
  })
  declare maxOrderQuantity?: number;

  // =========================================================================
  // Display
  // =========================================================================

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Image URL must be a valid URL',
      },
    },
  })
  declare imageUrl?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Thumbnail URL must be a valid URL',
      },
    },
  })
  declare thumbnailUrl?: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare displayOrder: number;

  @Index('idx_items_featured')
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare featured: boolean;

  // =========================================================================
  // Metadata
  // =========================================================================

  @Index('idx_items_sku')
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare sku?: string;

  @Index('idx_items_barcode')
  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare barcode?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare tags?: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare optionGroupIds?: string[];

  // =========================================================================
  // Timestamps
  // =========================================================================

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  // =========================================================================
  // Hooks
  // =========================================================================

  @BeforeCreate
  @BeforeUpdate
  static normalizeFields(instance: ItemModel) {
    // Normalize name
    if (instance.changed('name') && typeof instance.name === 'string') {
      instance.name = instance.name.trim();
    }

    // Normalize description
    if (
      instance.changed('description') &&
      typeof instance.description === 'string'
    ) {
      instance.description = instance.description.trim();
    }

    // Normalize short description
    if (
      instance.changed('shortDescription') &&
      typeof instance.shortDescription === 'string'
    ) {
      instance.shortDescription = instance.shortDescription.trim();
    }

    // Normalize SKU (uppercase)
    if (instance.changed('sku') && typeof instance.sku === 'string') {
      instance.sku = instance.sku.trim().toUpperCase();
    }

    // Normalize barcode (remove spaces)
    if (instance.changed('barcode') && typeof instance.barcode === 'string') {
      instance.barcode = instance.barcode.replace(/\s+/g, '');
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static validatePricing(instance: ItemModel) {
    // Ensure discount price is less than regular price
    if (
      instance.discountPrice !== null &&
      instance.discountPrice !== undefined &&
      instance.price !== null &&
      instance.price !== undefined
    ) {
      if (Number(instance.discountPrice) >= Number(instance.price)) {
        throw new Error('Discount price must be less than regular price');
      }
    }

    // Validate discount dates
    if (instance.discountStartDate && instance.discountEndDate) {
      if (
        new Date(instance.discountStartDate) >
        new Date(instance.discountEndDate)
      ) {
        throw new Error('Discount start date must be before end date');
      }
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static validateOrderQuantities(instance: ItemModel) {
    // Ensure max order quantity is greater than min
    if (
      instance.maxOrderQuantity !== null &&
      instance.maxOrderQuantity !== undefined &&
      instance.minOrderQuantity !== null &&
      instance.minOrderQuantity !== undefined
    ) {
      if (instance.maxOrderQuantity < instance.minOrderQuantity) {
        throw new Error(
          'Maximum order quantity must be greater than or equal to minimum order quantity'
        );
      }
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static validateDietaryConsistency(instance: ItemModel) {
    // If vegan, must also be vegetarian
    if (instance.isVegan && !instance.isVegetarian) {
      instance.isVegetarian = true;
    }

    // Vegan items cannot contain milk or eggs
    if (instance.isVegan) {
      if (instance.containsMilk || instance.containsEggs) {
        throw new Error('Vegan items cannot contain milk or eggs');
      }
    }

    // Vegetarian items cannot contain fish or shellfish
    if (instance.isVegetarian) {
      if (instance.containsFish || instance.containsShellfish) {
        throw new Error('Vegetarian items cannot contain fish or shellfish');
      }
    }

    // Lactose-free items cannot contain milk
    if (instance.isLactoseFree && instance.containsMilk) {
      throw new Error('Lactose-free items cannot contain milk');
    }

    // Gluten-free items cannot contain wheat
    if (instance.isGlutenFree && instance.containsWheat) {
      throw new Error('Gluten-free items cannot contain wheat');
    }
  }

  // =========================================================================
  // Instance Methods
  // =========================================================================

  toJSON() {
    const attributes = { ...this.get() } as Record<string, unknown>;
    return attributes;
  }

  /**
   * Get the current effective price (discount if active, otherwise regular)
   */
  getCurrentPrice(): number {
    if (this.isDiscountActive()) {
      return Number(this.discountPrice);
    }
    return Number(this.price);
  }

  /**
   * Check if discount is currently active
   */
  isDiscountActive(): boolean {
    if (!this.discountPrice) return false;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (this.discountStartDate && new Date(this.discountStartDate) > today) {
      return false;
    }

    if (this.discountEndDate && new Date(this.discountEndDate) < today) {
      return false;
    }

    return true;
  }

  /**
   * Get discount percentage
   */
  getDiscountPercentage(): number {
    if (!this.discountPrice || !this.price) return 0;
    const discount =
      ((Number(this.price) - Number(this.discountPrice)) / Number(this.price)) *
      100;
    return Math.round(discount * 100) / 100;
  }

  /**
   * Check if item is in stock
   */
  isInStock(): boolean {
    if (this.stockQuantity === null || this.stockQuantity === undefined) {
      return true; // No stock tracking
    }
    return this.stockQuantity > 0;
  }

  /**
   * Check if stock is low
   */
  isLowStock(): boolean {
    if (
      this.stockQuantity === null ||
      this.stockQuantity === undefined ||
      this.lowStockThreshold === null ||
      this.lowStockThreshold === undefined
    ) {
      return false;
    }
    return this.stockQuantity <= this.lowStockThreshold;
  }

  /**
   * Get list of allergens present in this item
   */
  getAllergens(): string[] {
    const allergens: string[] = [];

    if (this.containsNuts) allergens.push('Nuts');
    if (this.containsPeanuts) allergens.push('Peanuts');
    if (this.containsSoy) allergens.push('Soy');
    if (this.containsEggs) allergens.push('Eggs');
    if (this.containsFish) allergens.push('Fish');
    if (this.containsShellfish) allergens.push('Shellfish');
    if (this.containsWheat) allergens.push('Wheat');
    if (this.containsMilk) allergens.push('Milk');
    if (this.containsSesame) allergens.push('Sesame');
    if (this.containsSulfites) allergens.push('Sulfites');

    return allergens;
  }

  /**
   * Get list of dietary labels for this item
   */
  getDietaryLabels(): string[] {
    const labels: string[] = [];

    if (this.isHalal) labels.push('Halal');
    if (this.isKosher) labels.push('Kosher');
    if (this.isVegan) labels.push('Vegan');
    if (this.isVegetarian) labels.push('Vegetarian');
    if (this.isGlutenFree) labels.push('Gluten-Free');
    if (this.isLactoseFree) labels.push('Lactose-Free');
    if (this.isOrganic) labels.push('Organic');
    if (this.isBio) labels.push('Bio');
    if (this.isHomemade) labels.push('Homemade');

    return labels;
  }

  /**
   * Get preparation method description
   */
  getPreparationMethod(): string {
    const methods: string[] = [];

    if (this.isRaw) methods.push('Raw');
    if (this.isCooked) methods.push('Cooked');
    if (this.isFried) methods.push('Fried');
    if (this.isGrilled) methods.push('Grilled');
    if (this.isSteamed) methods.push('Steamed');

    return methods.join(', ') || 'Not specified';
  }

  /**
   * Get formatted price with currency
   */
  getFormattedPrice(): string {
    const currencySymbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
      GBP: '£',
      CHF: 'CHF',
    };

    const symbol = currencySymbols[this.currency] || this.currency;
    const price = this.getCurrentPrice().toFixed(2);

    if (this.currency === 'EUR') {
      return `${price} ${symbol}`;
    }
    return `${symbol}${price}`;
  }

  /**
   * Check if item can be ordered for a specific fulfillment method
   */
  canOrderFor(method: 'delivery' | 'pickup' | 'dineIn'): boolean {
    if (!this.available || !this.isInStock()) return false;

    switch (method) {
      case 'delivery':
        return this.availableForDelivery;
      case 'pickup':
        return this.availableForPickup;
      case 'dineIn':
        return this.availableForDineIn;
      default:
        return false;
    }
  }
}
