import { Chemical } from './chemical';
import { Industry } from './industry';

export interface IndustryChemical {
    chemicalId: string;
    industryId: string;
    chemical?: Chemical;
    industry?: Industry;
}