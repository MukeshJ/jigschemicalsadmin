import { Component, OnInit, signal } from '@angular/core';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Role } from '@core/domain-classes/role';
import { CommonError } from '@core/error-handler/common-error';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { RoleService } from '../role.service';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { RouterLink } from '@angular/router';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLink,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class RoleListComponent extends BaseComponent implements OnInit {
  roles: Role[] = [];
  displayedColumns: string[] = ['action', 'name'];
  isLoadingResults = signal<boolean>(false);

  constructor(
    private roleService: RoleService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private commonService: CommonService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getRoles();
  }

  deleteRole(role: Role) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${role.name}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.roleService.deleteRole(role.id).subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('ROLE_DELETED_SUCCESSFULLY'),
            );
            this.getRoles();
          });
        }
      });
  }

  getRoles(): void {
    this.isLoadingResults.set(true);
    this.sub$.sink = this.commonService.getRoles().subscribe(
      (data: Role[]) => {
        this.isLoadingResults.set(false);
        this.roles = data;
      },
      (err: CommonError) => {
        err.messages.forEach((msg) => {
          this.toastrService.error(msg);
        });
      },
    );
  }
}
