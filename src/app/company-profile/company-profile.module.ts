import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileComponent } from './company-profile.component';
import { CompanyProfileRoutingModule } from './company-profile-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    CompanyProfileRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    CompanyProfileComponent,
  ],
})
export class CompanyProfileModule {}
