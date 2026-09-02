import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactUsRoutingModule } from './contact-us-routing.module';
import { ContactUsComponent } from './contact-us.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslatePipe, TranslateDirective } from '@ngx-translate/core';
import { ContactUsDetailComponent } from './contact-us-detail/contact-us-detail.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SharedModule } from '@shared/shared.module';
import { ContactRequestTypePipe } from '@shared/pipes/contact-request-type-pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  providers: [ContactRequestTypePipe],
  imports: [
    CommonModule,
    ContactUsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    AngularEditorModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatMenuModule,
    MatDialogModule,
    TranslatePipe,
    TranslateDirective,
    MatButtonModule,
    MatNativeDateModule,
    MatIconModule,
    ContactUsComponent,
    ContactUsDetailComponent,
  ],
})
export class ContactUsModule {}
