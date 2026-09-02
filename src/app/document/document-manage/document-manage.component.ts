import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Category } from '@core/domain-classes/category';
import { DocumentCategoryService } from '@core/services/document-category.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { DocumentService } from '../document.service';
import { DocumentInfo } from '@core/domain-classes/document-info';
import { Router } from '@angular/router';
import { DocumentAuditTrail } from '@core/domain-classes/document-audit-trail';
import { DocumentOperation } from '@core/domain-classes/document-operation';
import { CommonService } from '@core/services/common.service';

@Component({
  selector: 'app-document-manage',
  templateUrl: './document-manage.component.html',
  styleUrls: ['./document-manage.component.scss']
})
export class DocumentManageComponent extends BaseComponent implements OnInit {

  documentForm: FormGroup;
  categories$: Observable<Category[]>;
  loading$: Observable<boolean>;
  documentSource: string;

  constructor(
    private categoryService: DocumentCategoryService,
    private toastrService: ToastrService,
    private documentService: DocumentService,
    private router: Router,
    private commonService: CommonService) {
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
    this.categories$ = this.categoryService.entities$;
  }
  getCategories(): void {
    this.categoryService.getAll();
  }

  saveDocument(document: DocumentInfo) {
    this.sub$.sink = this.documentService.addDocument(document)
      .subscribe((documentInfo:DocumentInfo) => {
        this.addDocumentTrail(documentInfo.id);
        this.toastrService.success('Document save successfully.');
        this.router.navigate(['/documents']);
      });
  }
  addDocumentTrail(id: string) {
    const objDocumentAuditTrail: DocumentAuditTrail = {
      documentId: id,
      operationName: DocumentOperation.Created.toString()
    }
    this.sub$.sink = this.commonService.addDocumentAuditTrail(objDocumentAuditTrail)
      .subscribe(c => {
      })
  }

}
