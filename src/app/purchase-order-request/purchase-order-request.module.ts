import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseOrderRequestListComponent } from './purchase-order-request-list/purchase-order-request-list.component';
import { PurchaseOrderRequestAddEditComponent } from './purchase-order-request-add-edit/purchase-order-request-add-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';
import { PurchaseOrderRequestRoutingModule } from './purchase-order-request-routing.module';
import { PurchaseOrderRequestItemsComponent } from './purchase-order-request-list/purchase-order-request-items/purchase-order-request-items.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PurchaseOrderRequestRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatDividerModule,
    PurchaseOrderRequestListComponent,
    PurchaseOrderRequestAddEditComponent,
    PurchaseOrderRequestItemsComponent,
  ],
})
export class PurchaseOrderRequestModule {}
