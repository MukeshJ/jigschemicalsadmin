import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatFooterCellDef,
  MatFooterCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Testimonial } from '@core/domain-classes/testimonial';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { TestimonialService } from '../testimonial.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-testimonial-list',
  templateUrl: './testimonial-list.component.html',
  styleUrls: ['./testimonial-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLink,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    UTCToLocalTime,
    TranslatePipe,
  ],
})
export class TestimonialListComponent extends BaseComponent implements OnInit {
  testimonials: Testimonial[] = [];
  dataSource: MatTableDataSource<Testimonial>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  isLoading = false;
  displayedColumns: string[] = ['action', 'name', 'designation', 'isActive', 'createdDate'];
  footerToDisplayed: string[] = ['footer'];
  pageSize = 15;
  constructor(
    private router: Router,
    private testimonialService: TestimonialService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
    private toastrService: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getTestimonials();
  }

  getTestimonials() {
    this.isLoading = true;
    this.sub$.sink = this.testimonialService.getTestimonials().subscribe(
      (testimonials) => {
        this.testimonials = testimonials;
        this.dataSource = new MatTableDataSource(this.testimonials);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  editTestimonial(id: string) {
    this.router.navigate(['/testimonial/manage', id]);
  }

  deleteTestimonial(testimonial: Testimonial) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.testimonialService
            .deleteTestimonial(testimonial.id)
            .subscribe(() => {
              this.toastrService.success(
                this.translationService.getValue('TESTIMONIAL_DELETED_SUCCESSFULLY'),
              );
              if (this.paginator) {
                this.paginator.pageIndex = 0;
              }
              this.getTestimonials();
            });
        }
      });
  }
}
