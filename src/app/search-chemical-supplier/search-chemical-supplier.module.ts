import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchChemicalBySupplierComponent } from './search-chemical-by-supplier/search-chemical-by-supplier.component';
import { SearchChemicalSupplierRoutingModule } from './search-chemical-supplier-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { SearchSupplierByChemicalComponent } from './search-supplier-by-chemical/search-supplier-by-chemical.component';



@NgModule({
  declarations: [SearchChemicalBySupplierComponent, SearchSupplierByChemicalComponent],
  imports: [
    CommonModule,
    SearchChemicalSupplierRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCardModule
  ]
})
export class SearchChemicalSupplierModule { }
