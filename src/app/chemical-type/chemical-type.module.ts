import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { ChemicalTypeRoutingModule } from './chemical-type-routing.module';
import { ChemicalTypeListComponent } from './chemical-type-list/chemical-type-list.component';
import { ChemicalTypeAddComponent } from './chemical-type-add/chemical-type-add.component';
import { MatCardModule } from '@angular/material/card';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    ChemicalTypeListComponent,
    ChemicalTypeAddComponent
  ],
  imports: [
    CommonModule,
    TranslatePipe,
    TranslateDirective,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    AngularEditorModule,
    ChemicalTypeRoutingModule,
    MatCardModule,
    MatCheckboxModule,
    MatSlideToggleModule
  ]
})
export class ChemicalTypeModule { }
