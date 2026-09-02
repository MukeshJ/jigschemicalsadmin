import { SelectionModel } from '@angular/cdk/collections';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Category } from '@core/domain-classes/category';
import { DocumentCategories } from '@core/domain-classes/document-categories';
import { ResponseHeader } from '@core/domain-classes/document-header';
import { DocumentInfo } from '@core/domain-classes/document-info';
import { DocumentResource } from '@core/domain-classes/document-resource';
import { DocumentCategoryService } from '@core/services/document-category.service';
import { TranslationService } from '@core/services/translation.service';
import { DocumentViewComponent } from '@shared/document-view/document-view.component';
import { OverlayPanel } from '@shared/overlay-panel/overlay-panel.service';
import { ToastrService } from 'ngx-toastr';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { DocumentLibraryService } from 'src/app/document-library/document-library.service';
import { DocumentEditComponent } from '../document-edit/document-edit.component';
import { DocumentPermissionListComponent } from '../document-permission/document-permission-list/document-permission-list.component';
import { DocumentPermissionMultipleComponent } from '../document-permission/document-permission-multiple/document-permission-multiple.component';
import { DocumentService } from '../document.service';
import { DocumentDataSource } from './document-datasource';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent extends BaseComponent implements OnInit, AfterViewInit {
  dataSource: DocumentDataSource;
  documents: DocumentInfo[] = [];
  displayedColumns: string[] = ['select', 'action', 'name', 'categoryName', 'createdDate', 'createdBy'];
  footerToDisplayed: Array<string> = ['footer'];
  isLoadingResults = true;
  documentResource: DocumentResource;
  categories: Category[] = [];
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  selection = new SelectionModel<DocumentInfo>(true, []);
  constructor(
    private documentService: DocumentService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private categoryService: DocumentCategoryService,
    private dialog: MatDialog,
    public overlay: OverlayPanel,
    private documentLibraryService: DocumentLibraryService,
    private translationService: TranslationService
  ) {
    super();
    this.documentResource = new DocumentResource();
    this.documentResource.pageSize = 10;
    this.documentResource.orderBy = "CreatedDate desc";

  }

  ngOnInit(): void {
    this.dataSource = new DocumentDataSource(this.documentService);
    this.dataSource.loadDocuments(this.documentResource);

    this.sub$.sink = this.categoryService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getCategories();
          }
        }),
        filter(loaded => !!loaded)
      ).subscribe();

    this.sub$.sink = this.categoryService.entities$
      .subscribe(c => {
        this.categories = [...c];
      });
    this.getResourceParameter();
  }

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.documentResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.documentResource.pageSize = this.paginator.pageSize;
          this.documentResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadDocuments(this.documentResource);
        })
      )
      .subscribe();

    this.sub$.sink = fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.documentResource.name = this.input.nativeElement.value;
          this.dataSource.loadDocuments(this.documentResource);
        })
      )
      .subscribe();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onCategoryChange(filtervalue: any) {
    if (filtervalue.value) {
      this.documentResource.categoryId = filtervalue.value;
    } else {
      this.documentResource.categoryId = '';
    }
    this.documentResource.skip = 0;
    this.dataSource.loadDocuments(this.documentResource);
  }

  onCreatedDateChange(filtervalue: any) {
    if (filtervalue) {
      this.documentResource.createDate = filtervalue;
    } else {
      this.documentResource.createDate = null;
    }
    this.documentResource.skip = 0;
    this.dataSource.loadDocuments(this.documentResource);
  }

  getCategories(): void {
    this.categoryService.getAll();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.documentResource.pageSize = c.pageSize;
          this.documentResource.skip = c.skip;
          this.documentResource.totalCount = c.totalCount;
        }
      });
  }

  deleteDocument(document: DocumentInfo) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${document.name}`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.documentService.deleteDocument(document.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('DOCUMENT_DELETED_SUCCESSFULLY'));
              this.dataSource.loadDocuments(this.documentResource);
            });
        }
      });
  }

  getDocuments(): void {
    this.isLoadingResults = true;
    this.sub$.sink = this.documentService.getDocuments(this.documentResource)
      .subscribe(
        (resp: HttpResponse<DocumentInfo[]>) => {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this.documentResource.pageSize = paginationParam.pageSize;
          this.documentResource.skip = paginationParam.skip;
          this.documents = [...resp.body];
          this.isLoadingResults = false;
        },
        () => (this.isLoadingResults = false)
      );
  }

  editDocument(documentInfo: DocumentInfo) {
    const documentCategories: DocumentCategories = {
      document: documentInfo,
      categories: this.categories
    }
    const dialogRef = this.dialog.open(DocumentEditComponent, {
      width: '600px',
      data: Object.assign({}, documentCategories)
    });

    this.sub$.sink = dialogRef.afterClosed()
      .subscribe((result: string) => {
        if (result === 'loaded') {
          this.dataSource.loadDocuments(this.documentResource);
        }
      });
  }

  manageDocumentPermission(documentInfo: DocumentInfo) {
    this.dialog.open(DocumentPermissionListComponent,
      {
        data: documentInfo,
        width: '80vw',
        height: '80vh'
      });
  }
  onSharedSelectDocument() {
    this.dialog.open(DocumentPermissionMultipleComponent,
      {
        data: this.selection.selected,
        width: '80vw',
      });
  }

  downloadDocument(documentInfo: DocumentInfo) {
    this.sub$.sink = this.documentLibraryService.downloadDocument(documentInfo.id).subscribe(
      (event) => {
        if (event.type === HttpEventType.Response) {
          this.downloadFile(event, documentInfo);
        }
      },
      (error) => {
        this.toastrService.error(this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'));
      }
    );
  }

  onDocumentView(document: DocumentInfo) {
    this.overlay.open(DocumentViewComponent, {
      position: 'center',
      origin: 'global',
      panelClass: ['file-preview-overlay-container', 'white-background'],
      data: { documentId: document.id, isRestricted: false }
    });
  }

  private downloadFile(data: HttpResponse<Blob>, documentInfo: DocumentInfo) {
    const downloadedFile = new Blob([data.body], { type: data.body.type });
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.download = documentInfo.name;
    a.href = URL.createObjectURL(downloadedFile);
    a.target = '_blank';
    a.click();
    document.body.removeChild(a);
  }
}
