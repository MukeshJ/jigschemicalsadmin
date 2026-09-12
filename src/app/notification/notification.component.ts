import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { ReminderResourceParameter } from '@core/domain-classes/reminder-resource-parameter';
import { ReminderScheduler } from '@core/domain-classes/reminder-scheduler';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import { NotificationDataSource } from './notification-datasource';
import { NotificationService } from './notification.service';
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
import { RouterLink } from '@angular/router';
import { UTCToLocalTime } from '../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
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
  ],
})
export class NotificationComponent extends BaseComponent implements OnInit {
  dataSource: NotificationDataSource;
  reminders: ReminderScheduler[] = [];
  displayedColumns: string[] = ['createdDate', 'subject', 'message'];
  footerToDisplayed = ['footer'];
  isLoadingResults = true;
  reminderResource: ReminderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _subjectFilter: string;
  _messageFilter: string;
  _frequencyFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();

  public get SubjectFilter(): string {
    return this._subjectFilter;
  }

  public set SubjectFilter(v: string) {
    this._subjectFilter = v;
    const subjectFilter = `subject:${v}`;
    this.filterObservable$.next(subjectFilter);
  }

  public get MessageFilter(): string {
    return this._messageFilter;
  }
  public set MessageFilter(v: string) {
    this._messageFilter = v;
    const messageFilter = `message:${v}`;
    this.filterObservable$.next(messageFilter);
  }

  constructor(private notificationService: NotificationService) {
    super();
    this.reminderResource = new ReminderResourceParameter();
    this.reminderResource.pageSize = 15;
    this.reminderResource.orderBy = 'createdDate asc';
  }

  ngOnInit(): void {
    this.dataSource = new NotificationDataSource(this.notificationService);
    this.dataSource.loadData(this.reminderResource);
    this.getResourceParameter();
    this.markAsReadNotification();
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.reminderResource.skip = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'subject') {
          this.reminderResource.subject = escape(strArray[1]);
        } else if (strArray[0] === 'message') {
          this.reminderResource.message = strArray[1];
        }
        this.dataSource.loadData(this.reminderResource);
      });
  }

  markAsReadNotification() {
    this.sub$.sink = this.notificationService.markAsReadNotifications().subscribe((c) => {});
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.reminderResource.pageSize = c.pageSize;
        this.reminderResource.skip = c.skip;
        this.reminderResource.totalCount = c.totalCount;
      }
    });
  }

  ngAfterViewInit() {
    this.sub$.sink = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.reminderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.reminderResource.pageSize = this.paginator.pageSize;
          this.reminderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.reminderResource);
        }),
      )
      .subscribe();
  }
}
