import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentAuditTrailRoutingModule } from './document-audit-trail-routing.module';
import { DocumentAuditTrailComponent } from './document-audit-trail.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [DocumentAuditTrailComponent],
  imports: [
    CommonModule,
    DocumentAuditTrailRoutingModule,
    SharedModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
  ]
})
export class DocumentAuditTrailModule { }
