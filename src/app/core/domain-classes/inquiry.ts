import { Chemical } from './chemical';
import { InquiryChemical } from './inquiry-chemical';

export interface Inquiry {
  id?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  mobileNo?: string;
  phone?: string;
  address?: string;
  website?: string;
  countryName?: string;
  description?: string;
  cityName?: string;
  message?: string;
  cityId?: string;
  countryId?: string;
  createdDate?: Date;
  inquiryChemicals?: InquiryChemical[];
  inquirySourceId: string;
  inquiryStatusId: string;
  assignTo?: string;
  inquiryStatus?: string;
  assignToName?: string;
  inquiryActivityCount?: number;
  inquiryAttachmentCount?: number;
  inquiryNoteCount?: number;

}

export interface InquiryChemicalDto {
  chemicalId: string;
  inquiryId: string;
  chemical: Chemical;
}
