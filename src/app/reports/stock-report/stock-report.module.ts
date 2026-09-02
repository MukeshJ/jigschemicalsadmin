import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReportComponent } from './stock-report.component';
import { InventoryHistoryListComponent } from './inventory-history-list/inventory-history-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '@shared/shared.module';
import { StockReportRoutingModule } from './stock-report-routing.module';
import { AngularEditorModule } from '@kolkov/angular-editor';



@NgModule({
  declarations: [
    StockReportComponent,
    InventoryHistoryListComponent
  ],
  imports: [
    CommonModule,
    StockReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
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
    MatDividerModule
  ]
})
export class StockReportModule { }
