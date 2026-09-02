import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { DocumentCategoryListComponent } from './document-category-list/document-category-list.component';

const routes: Routes = [
  {
    path:'',
    component: DocumentCategoryListComponent,
    data: { claimType: 'documents_view_document_categories' },
    canActivate: [AuthGuard],
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentCategoryRoutingModule { }
