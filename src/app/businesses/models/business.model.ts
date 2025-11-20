// src/models/business.model.ts
/**
 * =============================================================================
 * BusinessModel – Sequelize (sequelize-typescript)
 * =============================================================================
 * Stores information about businesses in France, including:
 * - SIRET (14-digit unique identifier for establishments)
 * - SIREN (9-digit unique identifier for legal entities)
 * - Legal form (SARL, SAS, SA, etc.)
 * - NAF/APE code (business activity classification)
 * - Company registration details
 * =============================================================================
 */

import {
  Column,
  Model,
  Table,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  Unique,
  Index,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from '../../users/models/user.model.js';



export interface BusinessAttributes {
  businessId: string;
  userId: string;

  // French Business Identifiers
  siret: string;
  siren: string;

  // Business Information
  legalName: string;
  tradeName?: string;
  legalForm: string;

  // Activity Classification
  nafCode?: string;
  activityDescription?: string;

  // Registration Details
  rcsNumber?: string;
  rcsCity?: string;
  registrationDate?: Date;

  // Capital Information
  capital?: number;
  capitalCurrency: string;

  // Address
  addressLine1: string;
  addressLine2?: string;
  postalCode: string;
  city: string;
  department?: string;
  region?: string;
  country: string;

  // Contact Information
  phone?: string;
  email?: string;
  website?: string;

  // VAT
  vatNumber?: string;
  vatExempt: boolean;

  // Status
  active: boolean;
  closureDate?: Date;

  // Timestamps
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface BusinessCreationAttributes
  extends Optional<
    BusinessAttributes,
    | 'businessId'
    | 'tradeName'
    | 'nafCode'
    | 'activityDescription'
    | 'rcsNumber'
    | 'rcsCity'
    | 'registrationDate'
    | 'capital'
    | 'addressLine2'
    | 'department'
    | 'region'
    | 'phone'
    | 'email'
    | 'website'
    | 'vatNumber'
    | 'closureDate'
    | 'createdAt'
    | 'updatedAt'
  > {}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

@Table({
  tableName: 'businesses',
  timestamps: true,
  indexes: [
    { name: 'uk_businesses_siret', unique: true, fields: ['siret'] },
    { name: 'idx_businesses_siren', fields: ['siren'] },
    { name: 'idx_businesses_user_id', fields: ['userId'] },
    { name: 'idx_businesses_postal_code', fields: ['postalCode'] },
    { name: 'idx_businesses_naf_code', fields: ['nafCode'] },
    { name: 'idx_businesses_active', fields: ['active'] },
  ],
})
export class BusinessModel
  extends Model<BusinessAttributes, BusinessCreationAttributes>
  implements BusinessAttributes
{
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
    unique: true,
  })
  declare businessId: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  // Note: Association is defined in src/models/associations.ts
  // User relationship will be available via businessInstance.user

  // =========================================================================
  // French Business Identifiers
  // =========================================================================

  @Unique('uk_businesses_siret')
  @Index('uk_businesses_siret')
  @Column({
    type: DataType.STRING(14),
    allowNull: false,
    validate: {
      len: {
        args: [14, 14],
        msg: 'SIRET must be exactly 14 digits',
      },
      isNumeric: {
        msg: 'SIRET must contain only numbers',
      },
    },
  })
  declare siret: string;

  @Index('idx_businesses_siren')
  @Column({
    type: DataType.STRING(9),
    allowNull: false,
    validate: {
      len: {
        args: [9, 9],
        msg: 'SIREN must be exactly 9 digits',
      },
      isNumeric: {
        msg: 'SIREN must contain only numbers',
      },
    },
  })
  declare siren: string;

  // =========================================================================
  // Business Information
  // =========================================================================

  @Column({
    type: DataType.STRING(191),
    allowNull: false,
    validate: {
      len: {
        args: [2, 191],
        msg: 'Legal name must be between 2 and 191 characters',
      },
    },
  })
  declare legalName: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
  })
  declare tradeName?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      isIn: {
        args: [
          [
            'SARL',
            'EURL',
            'SAS',
            'SASU',
            'SA',
            'SNC',
            'SCS',
            'SCA',
            'EI',
            'EIRL',
            'Auto-entrepreneur',
            'Micro-entreprise',
            'Association',
            'SCI',
            'SCOP',
            'GIE',
            'Other',
          ],
        ],
        msg: 'Invalid legal form',
      },
    },
  })
  declare legalForm: string;

  // =========================================================================
  // Activity Classification
  // =========================================================================

  @Index('idx_businesses_naf_code')
  @Column({
    type: DataType.STRING(6),
    allowNull: true,
    validate: {
      is: {
        args: /^[0-9]{2}\.[0-9]{2}[A-Z]?$/,
        msg: 'NAF code must be in format XX.XXX (e.g., 62.01Z)',
      },
    },
  })
  declare nafCode?: string;

  @Column({
    type: DataType.STRING(500),
    allowNull: true,
  })
  declare activityDescription?: string;

  // =========================================================================
  // Registration Details
  // =========================================================================

  @Column({
    type: DataType.STRING(50),
    allowNull: true,
  })
  declare rcsNumber?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare rcsCity?: string;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare registrationDate?: Date;

  // =========================================================================
  // Capital Information
  // =========================================================================

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Capital must be a positive number',
      },
    },
  })
  declare capital?: number;

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
  declare capitalCurrency: string;

  // =========================================================================
  // Address
  // =========================================================================

  @Column({
    type: DataType.STRING(191),
    allowNull: false,
  })
  declare addressLine1: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
  })
  declare addressLine2?: string;

  @Index('idx_businesses_postal_code')
  @Column({
    type: DataType.STRING(5),
    allowNull: false,
    validate: {
      is: {
        args: /^[0-9]{5}$/,
        msg: 'Postal code must be 5 digits',
      },
    },
  })
  declare postalCode: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare city: string;

  @Column({
    type: DataType.STRING(3),
    allowNull: true,
    validate: {
      is: {
        args: /^[0-9]{2}[AB]?$/,
        msg: 'Department code must be 2 digits optionally followed by A or B',
      },
    },
  })
  declare department?: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare region?: string;

  @Column({
    type: DataType.STRING(2),
    allowNull: false,
    defaultValue: 'FR',
    validate: {
      len: {
        args: [2, 2],
        msg: 'Country code must be 2 characters (ISO 3166-1 alpha-2)',
      },
    },
  })
  declare country: string;

  // =========================================================================
  // Contact Information
  // =========================================================================

  @Column({
    type: DataType.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^[+]?[0-9\s().-]{10,20}$/,
        msg: 'Invalid phone number format',
      },
    },
  })
  declare phone?: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
    validate: {
      isEmail: {
        msg: 'Email must be valid',
      },
    },
  })
  declare email?: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Website must be a valid URL',
      },
    },
  })
  declare website?: string;

  // =========================================================================
  // VAT
  // =========================================================================

  @Column({
    type: DataType.STRING(15),
    allowNull: true,
    validate: {
      is: {
        args: /^FR[0-9A-Z]{2}[0-9]{9}$/,
        msg: 'VAT number must be in format FRXX123456789',
      },
    },
  })
  declare vatNumber?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  declare vatExempt: boolean;

  // =========================================================================
  // Status
  // =========================================================================

  @Index('idx_businesses_active')
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  declare active: boolean;

  @Column({
    type: DataType.DATEONLY,
    allowNull: true,
  })
  declare closureDate?: Date;

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
  static normalizeFields(instance: BusinessModel) {
    // Normalize SIRET and SIREN (remove spaces)
    if (instance.changed('siret') && typeof instance.siret === 'string') {
      instance.siret = instance.siret.replace(/\s+/g, '');
    }
    if (instance.changed('siren') && typeof instance.siren === 'string') {
      instance.siren = instance.siren.replace(/\s+/g, '');
    }

    // Normalize email
    if (instance.changed('email') && typeof instance.email === 'string') {
      instance.email = instance.email.trim().toLowerCase();
    }

    // Normalize website
    if (instance.changed('website') && typeof instance.website === 'string') {
      instance.website = instance.website.trim();
    }

    // Normalize text fields
    if (
      instance.changed('legalName') &&
      typeof instance.legalName === 'string'
    ) {
      instance.legalName = instance.legalName.trim();
    }
    if (
      instance.changed('tradeName') &&
      typeof instance.tradeName === 'string'
    ) {
      instance.tradeName = instance.tradeName.trim();
    }
    if (instance.changed('city') && typeof instance.city === 'string') {
      instance.city = instance.city.trim();
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static validateSiretSiren(instance: BusinessModel) {
    // Ensure SIREN is the first 9 digits of SIRET
    if (instance.siret && instance.siren) {
      const sirenFromSiret = instance.siret.substring(0, 9);
      if (sirenFromSiret !== instance.siren) {
        throw new Error('SIREN must match the first 9 digits of SIRET');
      }
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static validateDepartmentFromPostalCode(instance: BusinessModel) {
    // Auto-populate department from postal code if not provided
    if (instance.changed('postalCode') && instance.postalCode) {
      const department = instance.postalCode.substring(0, 2);
      if (!instance.department) {
        instance.department = department;
      }
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
   * Get formatted SIRET with spaces (XXX XXX XXX XXXXX)
   */
  getFormattedSiret(): string {
    if (!this.siret) return '';
    return this.siret.replace(/(\d{3})(\d{3})(\d{3})(\d{5})/, '$1 $2 $3 $4');
  }

  /**
   * Get formatted SIREN with spaces (XXX XXX XXX)
   */
  getFormattedSiren(): string {
    if (!this.siren) return '';
    return this.siren.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }

  /**
   * Get full address as a single string
   */
  getFullAddress(): string {
    const parts = [
      this.addressLine1,
      this.addressLine2,
      `${this.postalCode} ${this.city}`,
      this.country,
    ].filter(Boolean);
    return parts.join(', ');
  }

  /**
   * Check if business is registered in RCS
   */
  isRegisteredInRCS(): boolean {
    return !!(this.rcsNumber && this.rcsCity);
  }

  /**
   * Get display name (trade name if available, otherwise legal name)
   */
  getDisplayName(): string {
    return this.tradeName || this.legalName;
  }
}
