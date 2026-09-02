import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output }
from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { DocumentCategory } from '@core/domain-classes/document-category';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageDocumentCategoryComponent } from '../manage-document-category/manage-document-category.component';

@Component({
  selector: 'app-document-category-list-presentation',
  templateUrl: './document-category-list-presentation.component.html',
  styleUrls: ['./document-category-list-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentCategoryListPresentationComponent  extends BaseComponent implements OnInit {

  @Input() categories: DocumentCategory[];
  @Input() loading: boolean = false;
  @Output() addEditCategoryHandler: EventEmitter<DocumentCategory> = new EventEmitter<DocumentCategory>();
  @Output() deleteCategoryHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private translationService:TranslationService
  ) {
    super();
  }

  ngOnInit(): void {
  }


  deleteCategory(category: DocumentCategory): void {
    this.sub$.sink = this.commonDialogService
    .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${category.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deleteCategoryHandler.emit(category.id);
        }
      });
  }

  manageCategory(category: DocumentCategory): void {
    const dialogRef = this.dialog.open(ManageDocumentCategoryComponent, {
      width: '350px',
      data: Object.assign({}, category)
    });

    this.sub$.sink = dialogRef.afterClosed()
    .subscribe((result: DocumentCategory) => {
      if (result) {
        this.addEditCategoryHandler.emit(result);
      }
    });
  }

}
