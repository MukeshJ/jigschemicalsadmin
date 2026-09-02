import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChemicalSuppliersComponent } from './chemical-suppliers/chemical-suppliers.component';
import { AddChemicalSupplierComponent } from './add-chemical-supplier/add-chemical-supplier.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SendEmailComponent } from './send-email/send-email.component';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { MatChipsModule } from '@angular/material/chips';
import { SharedModule } from '@shared/shared.module';
import { AngularEditorModule } from '@kolkov/angular-editor';

@NgModule({
  exports: [ChemicalSuppliersComponent, AddChemicalSupplierComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatTableModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslatePipe,
    TranslateDirective,
    AngularEditorModule,
    MatChipsModule,
    ChemicalSuppliersComponent,
    AddChemicalSupplierComponent,
    SendEmailComponent,
  ],
})
export class ChemicalSupplierModule {}
