import { Component, OnInit, ViewChild } from '@angular/core';
import { Industry } from '@core/domain-classes/industry';
import { BaseComponent } from 'src/app/base.component';
import { IndustryService } from '../industry.service';
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
import { MatPaginator } from '@angular/material/paginator';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-industry-list',
  templateUrl: './industry-list.component.html',
  styleUrls: ['./industry-list.component.scss'],
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
    TruncatePipe,
    TranslatePipe,
  ],
})
export class IndustryListComponent extends BaseComponent implements OnInit {
  industries: Industry[] = [];
  displayedColumns: string[] = ['action', 'name', 'description'];
  footerToDisplayed = ['footer'];
  dataSource: MatTableDataSource<Industry>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private industryService: IndustryService,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getIndustries();
  }

  getIndustries() {
    this.sub$.sink = this.industryService.getIndustries().subscribe((industries) => {
      this.industries = industries;
      this.dataSource = new MatTableDataSource(this.industries);
      this.dataSource.paginator = this.paginator;
    });
  }

  deleteIndustry(industry: Industry) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${industry.name}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.industryService.deleteIndustry(industry.id).subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('INDUSTRY_DELETED_SUCCESSFULLY'),
            );
            this.paginator.pageIndex = 0;
            this.getIndustries();
          });
        }
      });
  }
}
