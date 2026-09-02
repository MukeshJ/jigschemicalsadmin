import { ChemicalTax } from './chemical-tax';
import { EntityState } from './entity-state';
import { Unit } from './unit';

export interface Chemical {
  id?: string;
  name: string;
  casNumber: string;
  hBondAcceptor?: string;
  hBondDonor?: string;
  iupacName?: string;
  inChIKey?: string;
  molecularFormulla?: string;
  molecularWeight?: string;
  synonyms?: string;
  chemicalDetailId?: string;
  objectState?: EntityState;
  chemicalImage?: string;
  url?: string;
  imageUrl?: string;
  supplierCount?: number;
  lstChemicalIndustries?: Array<string>;
  listChemicalCategories?: Array<string>;
  chemicalIndustries?: ChemicalIndustry[];
  chemicalCategories?: ChemicalCategory[];
  customerCount?: number;
  isImageUpdate?: boolean;
  unitId?: string;
  unitName?: string;
  unit?: Unit;
  chemicalTaxes?: ChemicalTax[];
  purchasePrice?: number;
  salesPrice?: number;
  nameWithCasNumber?: string;
  isShowInFront?: boolean;
  categories?: Array<string>;
  industries?: Array<string>;
}

export interface ChemicalIndustry {
  chemicalId?: string;
  industryId?: string;
  objectState?: EntityState
}

export interface ChemicalCategory {
  chemicalId?: string;
  categoryId?: string;
  objectState?: EntityState
}

