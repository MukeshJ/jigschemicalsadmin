import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentManageResolver } from './document-manage/document-manage-resolver';
import { DocumentManageComponent } from './document-manage/document-manage.component';

export const routes: Routes = [
  {
    path: '', component: DocumentListComponent,
    data: { claimType: 'documents_view_documents' },
    canActivate: [AuthGuard],
  },
  {
    path: 'add',
    component: DocumentManageComponent,
    data: { claimType: 'documents_add_document' },
    canActivate: [AuthGuard],
  },
  {
    path: ':id',
    canActivate: [AuthGuard],
    component: DocumentManageComponent,
    resolve: {
      document: DocumentManageResolver
    },
    data: { claimType: 'documents_update_document' }
  },{
    path: 'permission',
    loadChildren: () =>
      import('./document-permission/document-permission.routes').then(m => m.routes)
  }
];
