import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierChemicalComponent } from './supplier-chemical.component';
import { SupplierChemicalRoutingModule } from './supplier-chemical-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { SharedModule } from '@shared/shared.module';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';



@NgModule({
  declarations: [SupplierChemicalComponent],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SupplierChemicalRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatCardModule,
    TranslatePipe,
    TranslateDirective
  ]
})
export class SupplierChemicalModule { }
