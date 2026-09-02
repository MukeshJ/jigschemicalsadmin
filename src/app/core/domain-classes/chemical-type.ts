export interface ChemicalType {
  id: string;
  name: string;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  isImageUpload?: boolean;
  imageData?: string;
  isShowFront?: boolean;
}
