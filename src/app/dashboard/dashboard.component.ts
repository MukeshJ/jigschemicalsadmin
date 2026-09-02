import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardStaticatics } from '@core/domain-classes/dashboard-staticatics';
import { Inquiry } from '@core/domain-classes/inquiry';
import { InquiryResourceParameter } from '@core/domain-classes/inquiry-resource-parameter';
import { SignalrService } from '@core/services/signalr.service';
import { BaseComponent } from '../base.component';
import { InquiryService } from '../inquiry/inquiry.service';
import { UserService } from '../user/user.service';
import { DashboardService } from './dashboard.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatNoDataRow,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HasClaimDirective } from '../shared/has-claim.directive';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { CalenderViewComponent } from './calender-view/calender-view.component';
import { InquiryChartComponent } from './inquiry-chart/inquiry-chart.component';
import { UTCToLocalTime } from '../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    HasClaimDirective,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    CalenderViewComponent,
    InquiryChartComponent,
    UTCToLocalTime,
    TranslatePipe,
  ],
})
export class DashboardComponent extends BaseComponent implements OnInit {
  dashboardStaticatics: DashboardStaticatics;
  inquiries = signal<Inquiry[]>([]);
  displayedInquiryColumns: string[] = [
    'action',
    'createdDate',
    'companyName',
    'status',
    'source',
    'assignTo',
    'email',
    'mobileNo',
    'cityName',
    'taskCount',
    'commentCount',
    'attachmentCount',
  ];
  inquiryResource: InquiryResourceParameter;

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    private signalrService: SignalrService,
    private inquiryService: InquiryService,
    private router: Router,
  ) {
    super();
    this.dashboardStaticatics = {
      inquiryCount: 0,
      chemicalCount: 0,
      customerCount: 0,
      supplierCount: 0,
    };
    this.inquiryResource = new InquiryResourceParameter();
    this.inquiryResource.pageSize = 10;
    this.inquiryResource.orderBy = 'createdDate desc';
  }

  ngOnInit() {
    this.getDashboardStaticatics();
    this.getTop10Inquiries();
  }

  getTop10Inquiries() {
    this.sub$.sink = this.inquiryService
      .getInquiries(this.inquiryResource)
      .subscribe((resp: HttpResponse<Inquiry[]>) => {
        this.inquiries.set([...resp.body]);
      });
  }

  getDashboardStaticatics() {
    this.sub$.sink = this.dashboardService
      .getDashboardStaticatics()
      .subscribe((c: DashboardStaticatics) => {
        this.dashboardStaticatics = c;
      });
  }

  editInquiry(inquiryId: string) {
    this.router.navigate(['/inquiry/manage', inquiryId]);
  }
}
