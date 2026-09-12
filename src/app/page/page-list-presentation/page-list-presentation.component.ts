import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { BaseComponent } from 'src/app/base.component';
import { Page } from '@core/domain-classes/page';
import { ManagePageComponent } from '../manage-page/manage-page.component';
import { TranslationService } from '@core/services/translation.service';
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
  selector: 'app-page-list-presentation',
  templateUrl: './page-list-presentation.component.html',
  styleUrls: ['./page-list-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
export class PageListPresentationComponent extends BaseComponent implements OnInit {
  @Input() pages: Page[];
  @Input() loading: boolean;
  @Output() deletePageHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];

  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {}

  deletePage(page: Page): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${page.name}`,
      )
      .subscribe((isTrue) => {
        if (isTrue) {
          this.deletePageHandler.emit(page.id);
        }
      });
  }

  managePage(page: Page): void {
    this.dialog.open(ManagePageComponent, {
      width: '350px',
      data: Object.assign({}, page),
    });
  }
}
