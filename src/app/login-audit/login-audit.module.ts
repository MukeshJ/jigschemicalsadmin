import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginAuditListComponent } from './login-audit-list/login-audit-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { LoginAuditRoutingModule } from './login-audit-routing.module';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    LoginAuditRoutingModule,
    SharedModule,
    TranslatePipe,
    TranslateDirective,
    LoginAuditListComponent,
  ],
})
export class LoginAuditModule {}
