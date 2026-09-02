import { GalleryCategoryEnum } from "src/app/gallery/categories-enum";

export interface Gallery {
  id?: string;
  name: string;
  description?: string;
  imageSrc?: string;
  url?: string;
  category?: GalleryCategoryEnum;
  createdDate?: Date;
  createdBy?: string;
  isImageUpload?: boolean;
}
