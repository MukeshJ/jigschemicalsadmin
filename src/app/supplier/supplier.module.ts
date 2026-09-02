import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierDetailComponent } from './supplier-detail/supplier-detail.component';
import { SupplierResolverService } from './supplier-detail/supplier-detail.resolver';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '@shared/shared.module';
import { MatMenuModule } from '@angular/material/menu';
import { ChemicalListComponent } from './chemical-list/chemical-list.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AddSupplierChemicalComponent } from './add-supplier-chemical/add-supplier-chemical.component';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { SupplierPOListComponent } from './supplier-list/supplier-po-list/supplier-po-list.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UploadChemicalComponent } from './upload-chemical/upload-chemical.component';

@NgModule({
  imports: [
    CommonModule,
    SupplierRoutingModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    AngularEditorModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatInputModule,
    MatMenuModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    TranslatePipe,
    TranslateDirective,
    SupplierDetailComponent,
    SupplierListComponent,
    ChemicalListComponent,
    AddSupplierChemicalComponent,
    SupplierPOListComponent,
    UploadChemicalComponent,
  ],
  providers: [SupplierResolverService],
})
export class SupplierModule {}
