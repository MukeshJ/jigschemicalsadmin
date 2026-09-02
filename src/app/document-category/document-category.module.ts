import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentCategoryRoutingModule } from './document-category-routing.module';
import { DocumentCategoryListComponent } from './document-category-list/document-category-list.component';
import { ManageDocumentCategoryComponent } from './manage-document-category/manage-document-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentCategoryListPresentationComponent } from './document-category-list-presentation/document-category-list-presentation.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DocumentCategoryRoutingModule,
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    DocumentCategoryListComponent,
    ManageDocumentCategoryComponent,
    DocumentCategoryListPresentationComponent,
  ],
})
export class DocumentCategoryModule {}
