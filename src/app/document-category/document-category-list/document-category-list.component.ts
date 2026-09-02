import { Component, OnInit } from '@angular/core';
import { DocumentCategory } from '@core/domain-classes/document-category';
import { DocumentCategoryService } from '@core/services/document-category.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-document-category-list',
  templateUrl: './document-category-list.component.html',
  styleUrls: ['./document-category-list.component.scss']
})
export class DocumentCategoryListComponent extends BaseComponent implements OnInit {
  categories$: Observable<DocumentCategory[]>;
  loading$: Observable<boolean>;
  constructor(
    private categoryService: DocumentCategoryService,
    private toastrService: ToastrService,
    private translationService:TranslationService) {
    super();
  }
  ngOnInit(): void {
    this.loading$ = this.categoryService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getCategories();
          }
        })
      )
    this.categories$ = this.categoryService.entities$
  }

  getCategories(): void {
    this.categoryService.getAll();
  }

  deleteCategory(id: string): void {
    this.categoryService.delete(id);
    this.toastrService.success(this.translationService.getValue('CATEGORY_DELETED_SUCCESSFULLY'));
  }

  manageCategory(category: DocumentCategory): void {
    if (category.id) {
      this.categoryService.update(category);
    } else {
      this.categoryService.add(category);
    }
    this.toastrService.success(this.translationService.getValue('CATEGORY_SAVE_SUCCESSFULLY'));
  }
}
