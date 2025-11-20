// src/interfaces/business.interface.ts
/**
 * =============================================================================
 * Business Interfaces
 * =============================================================================
 * Type definitions for Business model and operations
 * =============================================================================
 */

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
  extends Omit<
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
  > {
  tradeName?: string;
  nafCode?: string;
  activityDescription?: string;
  rcsNumber?: string;
  rcsCity?: string;
  registrationDate?: Date;
  capital?: number;
  addressLine2?: string;
  department?: string;
  region?: string;
  phone?: string;
  email?: string;
  website?: string;
  vatNumber?: string;
  closureDate?: Date;
}

export interface BusinessUpdateAttributes
  extends Partial<
    Omit<
      BusinessAttributes,
      'businessId' | 'userId' | 'siret' | 'siren' | 'createdAt' | 'updatedAt'
    >
  > {}

export interface BusinessFilters {
  businessId?: string;
  userId?: string;
  siret?: string;
  siren?: string;
  legalName?: string;
  tradeName?: string;
  legalForm?: string;
  nafCode?: string;
  postalCode?: string;
  city?: string;
  department?: string;
  region?: string;
  active?: boolean;
  vatExempt?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
}

export interface BusinessSearchCriteria {
  query?: string; // Search in legalName, tradeName, siret, siren
  legalForm?: string[];
  department?: string[];
  region?: string[];
  active?: boolean;
  vatExempt?: boolean;
  minCapital?: number;
  maxCapital?: number;
  registeredAfter?: Date;
  registeredBefore?: Date;
  hasRCS?: boolean;
  hasVAT?: boolean;
}

export interface BusinessResponse extends BusinessAttributes {
  user?: {
    userId: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export interface BusinessListResponse {
  businesses: BusinessResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * French Legal Forms
 */
export enum LegalForm {
  SARL = 'SARL', // Société à Responsabilité Limitée
  EURL = 'EURL', // Entreprise Unipersonnelle à Responsabilité Limitée
  SAS = 'SAS', // Société par Actions Simplifiée
  SASU = 'SASU', // Société par Actions Simplifiée Unipersonnelle
  SA = 'SA', // Société Anonyme
  SNC = 'SNC', // Société en Nom Collectif
  SCS = 'SCS', // Société en Commandite Simple
  SCA = 'SCA', // Société en Commandite par Actions
  EI = 'EI', // Entreprise Individuelle
  EIRL = 'EIRL', // Entreprise Individuelle à Responsabilité Limitée
  AUTO_ENTREPRENEUR = 'Auto-entrepreneur',
  MICRO_ENTREPRISE = 'Micro-entreprise',
  ASSOCIATION = 'Association',
  SCI = 'SCI', // Société Civile Immobilière
  SCOP = 'SCOP', // Société Coopérative et Participative
  GIE = 'GIE', // Groupement d'Intérêt Économique
  OTHER = 'Other',
}

/**
 * French Regions
 */
export enum FrenchRegion {
  AUVERGNE_RHONE_ALPES = 'Auvergne-Rhône-Alpes',
  BOURGOGNE_FRANCHE_COMTE = 'Bourgogne-Franche-Comté',
  BRETAGNE = 'Bretagne',
  CENTRE_VAL_DE_LOIRE = 'Centre-Val de Loire',
  CORSE = 'Corse',
  GRAND_EST = 'Grand Est',
  HAUTS_DE_FRANCE = 'Hauts-de-France',
  ILE_DE_FRANCE = 'Île-de-France',
  NORMANDIE = 'Normandie',
  NOUVELLE_AQUITAINE = 'Nouvelle-Aquitaine',
  OCCITANIE = 'Occitanie',
  PAYS_DE_LA_LOIRE = 'Pays de la Loire',
  PROVENCE_ALPES_COTE_AZUR = "Provence-Alpes-Côte d'Azur",
  GUADELOUPE = 'Guadeloupe',
  MARTINIQUE = 'Martinique',
  GUYANE = 'Guyane',
  LA_REUNION = 'La Réunion',
  MAYOTTE = 'Mayotte',
}

/**
 * Business Statistics
 */
export interface BusinessStatistics {
  totalBusinesses: number;
  activeBusinesses: number;
  inactiveBusinesses: number;
  byLegalForm: Record<string, number>;
  byRegion: Record<string, number>;
  byDepartment: Record<string, number>;
  averageCapital: number;
  withVAT: number;
  withoutVAT: number;
  registeredInRCS: number;
}
