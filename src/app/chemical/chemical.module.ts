import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChemicalListComponent } from './chemical-list/chemical-list.component';
import { ChemicalDetailComponent } from './chemical-detail/chemical-detail.component';
import { ChemicalRoutingModule } from './chemical-routing.module';
import { ChemicalComponent } from './chemical.component';
import { ChemicalDetailResolverService } from './chemical-detail/chemical-detail.resolver';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '@shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ChemicalCustomersComponent } from './chemical-customers/chemical-customers.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AddChemicalCustomerComponent } from './add-chemical-customer/add-chemical-customer.component';
import { ChemicalSupplierModule } from '../chemical-supplier/chemical-supplier.module';
import { BulkUploadChemicalComponent } from './bulk-upload-chemical/bulk-upload-chemical.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ChemicalRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSelectModule,
    MatSlideToggleModule,
    SharedModule,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    ChemicalSupplierModule,
    ChemicalListComponent,
    ChemicalDetailComponent,
    ChemicalComponent,
    ChemicalCustomersComponent,
    AddChemicalCustomerComponent,
    BulkUploadChemicalComponent,
  ],
  providers: [ChemicalDetailResolverService],
})
export class ChemicalModule {}
