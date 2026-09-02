import { Unit } from '@core/domain-classes/unit';
import { EntityMetadataMap } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  DocumentCategory: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Page: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Action: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  PageAction: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  DeliveryMethod: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  InquiryStatus: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  InquirySource: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  PaymentTerm: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  PackagingType: {
  },
  ExpenseCategory: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Tax: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
  Unit: {
    entityDispatcherOptions: { optimisticDelete: false, optimisticUpsert: false }
  },
};
const pluralNames = {
  DocumentCategory: 'DocumentCategories',
  Page: "Pages",
  Action: "Actions",
  PageAction: "PageActions",
  DeliveryMethod: 'DeliveryMethods',
  InquiryStatus: "InquiryStatuses",
  PackagingType: "PackagingTypes",
  InquirySource: "InquirySources",
  PaymentTerm: "PaymentTerms",
  ExpenseCategory: "ExpenseCategories",
  Tax: "Taxes",
  Unit:"Units"
};

export const entityConfig = {
  entityMetadata,
  pluralNames
};
