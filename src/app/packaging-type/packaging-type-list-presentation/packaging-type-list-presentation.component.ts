import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { PackagingType } from '@core/domain-classes/packaging-type';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManagePackagingTypeComponent } from '../manage-packaging-type/manage-packaging-type.component';
import { NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
  selector: 'app-packaging-type-list-presentation',
  templateUrl: './packaging-type-list-presentation.component.html',
  styleUrls: ['./packaging-type-list-presentation.component.scss'],
  imports: [
    NgIf,
    MatProgressSpinner,
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
export class PackagingTypeListPresentationComponent extends BaseComponent implements OnInit {
  @Input() packagingTypes: PackagingType[];
  @Input() loading: boolean = false;
  @Output() deletePackagingTypeHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {}

  deletePackagingType(packagingType: PackagingType): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${areU} :: ${packagingType.name}`)
      .subscribe((isTrue) => {
        if (isTrue) {
          this.deletePackagingTypeHandler.emit(packagingType.id);
        }
      });
  }

  managePackagingType(packagingType: PackagingType): void {
    this.dialog.open(ManagePackagingTypeComponent, {
      width: '350px',
      data: Object.assign({}, packagingType),
    });
  }
}
