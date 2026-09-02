import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { DocumentCategoryListComponent } from './document-category-list/document-category-list.component';

export const routes: Routes = [
  {
    path:'',
    component: DocumentCategoryListComponent,
    data: { claimType: 'documents_view_document_categories' },
    canActivate: [AuthGuard],
  }
];
