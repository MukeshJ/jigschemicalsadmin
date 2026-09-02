import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonDialogService } from './common-dialog/common-dialog.service';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoadingIndicatorModule } from '@shared/loading-indicator/loading-indicator.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonErrorHandlerService } from './error-handler/common-error-handler.service';
import { HttpClient } from '@angular/common/http';
import { ControlSidebarComponent } from './control-sidebar/control-sidebar.component';
import { CommonDialogComponent } from './common-dialog/common-dialog.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    RouterModule,
    SharedModule,
    MatTooltipModule,
    LoadingIndicatorModule,
    BsDropdownModule,
    NgbModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    ControlSidebarComponent,
    CommonDialogComponent,
  ],
  exports: [LayoutComponent],
  providers: [
    CommonDialogService,
    {
      provide: ErrorHandler,
      useClass: CommonErrorHandlerService,
      deps: [HttpClient],
    },
  ],
})
export class CoreModule {}
