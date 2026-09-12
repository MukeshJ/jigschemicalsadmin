import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { Router, RouterLink } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { User } from '@core/domain-classes/user';
import { UserResource } from '@core/domain-classes/user-resource';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { UserService } from '../user.service';
import { UserDataSource } from './user-datasource';
import { HasClaimDirective } from '../../shared/has-claim.directive';
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
  MatTableModule,
} from '@angular/material/table';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { Dir } from '@angular/cdk/bidi';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLink,
    MatTableModule,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatSortHeader,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    Dir,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    TranslatePipe,
  ],
})
export class UserListComponent extends BaseComponent implements OnInit, AfterViewInit {
  dataSource: UserDataSource;
  users: User[] = [];
  displayedColumns: string[] = [
    'action',
    'email',
    'firstName',
    'lastName',
    'phoneNumber',
    'isActive',
  ];
  isLoadingResults = true;
  footerToDisplayed = ['footer'];
  langDir: 'ltr' | 'rtl' = 'ltr';
  userResource: UserResource;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private dialog: MatDialog,
    private router: Router,
    private translationService: TranslationService,
  ) {
    super();
    this.userResource = new UserResource();
    this.userResource.pageSize = 10;
    this.userResource.orderBy = 'email desc';
  }

  ngOnInit(): void {
    this.dataSource = new UserDataSource(this.userService);
    this.dataSource.loadUsers(this.userResource);
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.userResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.userResource.pageSize = this.paginator.pageSize;
          this.userResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadUsers(this.userResource);
        }),
      )
      .subscribe();

    this.sub$.sink = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.userResource.name = this.input.nativeElement.value;
          this.dataSource.loadUsers(this.userResource);
        }),
      )
      .subscribe();
  }

  deleteUser(user: User) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${user.email}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.userService.deleteUser(user.id).subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('USER_DELETED_SUCCESSFULLY'),
            );
            this.paginator.pageIndex = 0;
            this.userResource.name = this.input.nativeElement.value;
            this.dataSource.loadUsers(this.userResource);
          });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.userResource.pageSize = c.pageSize;
        this.userResource.skip = c.skip;
        this.userResource.totalCount = c.totalCount;
      }
    });
  }

  resetPassword(user: User): void {
    this.dialog.open(ResetPasswordComponent, {
      width: '350px',
      data: Object.assign({}, user),
    });
  }

  editUser(userId: string) {
    this.router.navigate(['/users/manage', userId]);
  }

  userPermission(userId: string) {
    this.router.navigate(['/users/permission', userId]);
  }
}
