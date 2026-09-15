import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { LoginAudit } from '@core/domain-classes/login-audit';
import { LoginAuditResource } from '@core/domain-classes/login-audit-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { LoginAuditDataSource } from '../login-audit-datasource';
import { LoginAuditService } from '../login-audit.service';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatFooterCellDef,
  MatFooterCell,
  MatNoDataRow,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-audit-list',
  templateUrl: './login-audit-list.component.html',
  styleUrls: ['./login-audit-list.component.scss'],
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    UTCToLocalTime,
    TranslatePipe,
    AsyncPipe,
    MatProgressSpinner,
  ],
})
export class LoginAuditListComponent extends BaseComponent implements OnInit, AfterViewInit {
  dataSource: LoginAuditDataSource;
  loginAudits: LoginAudit[] = [];
  displayedColumns: string[] = [
    'loginTime',
    'userName',
    'remoteIP',
    'status',
    'latitude',
    'longitude',
  ];
  footerToDisplayed = ['footer'];
  isLoadingResults = true;
  loginAuditResource: LoginAuditResource;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private loginAuditService: LoginAuditService) {
    super();
    this.loginAuditResource = new LoginAuditResource();
    this.loginAuditResource.pageSize = 10;
    this.loginAuditResource.orderBy = 'loginTime desc';
  }

  ngOnInit(): void {
    this.dataSource = new LoginAuditDataSource(this.loginAuditService);
    this.dataSource.loadLoginAudits(this.loginAuditResource);
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.loginAuditResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.loginAuditResource.pageSize = this.paginator.pageSize;
          this.loginAuditResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadLoginAudits(this.loginAuditResource);
        }),
      )
      .subscribe();

    this.sub$.sink = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loginAuditResource.userName = this.input.nativeElement.value;
          this.dataSource.loadLoginAudits(this.loginAuditResource);
        }),
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.loginAuditResource.pageSize = c.pageSize;
        this.loginAuditResource.skip = c.skip;
        this.loginAuditResource.totalCount = c.totalCount;
      }
    });
  }
}
