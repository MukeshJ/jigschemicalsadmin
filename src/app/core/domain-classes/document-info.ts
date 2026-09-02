export interface DocumentInfo {
  id?: string;
  name?: string;
  url?: string;
  description?: string;
  createdDate?: Date;
  createdBy?: string;
  categoryId?: string;
  categoryName?: string;
  documentSource?: string;
  extension?: string;
  viewerType?: string;
  expiredDate?: Date;
  isAllowDownload?: boolean;
}
