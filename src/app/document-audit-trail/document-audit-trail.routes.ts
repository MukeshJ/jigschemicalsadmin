import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { DocumentAuditTrailComponent } from './document-audit-trail.component';

export const routes: Routes = [
  {
    path:'',
    component: DocumentAuditTrailComponent,
    data: { claimType: 'documents_view_document_audit_trail' },
    canActivate: [AuthGuard],
  }
];
