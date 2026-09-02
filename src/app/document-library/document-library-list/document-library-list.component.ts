import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Category } from '@core/domain-classes/category';
import { ResponseHeader } from '@core/domain-classes/document-header';
import { DocumentInfo } from '@core/domain-classes/document-info';
import { DocumentResource } from '@core/domain-classes/document-resource';
import { DocumentCategoryService } from '@core/services/document-category.service';
import { OverlayPanel } from '@shared/overlay-panel/overlay-panel.service';
import { fromEvent, merge, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { DocumentLibraryService } from '../document-library.service';
import { DocumentViewComponent } from '../../shared/document-view/document-view.component';
import { DocumentLibraryDataSource } from './document-library-datasource';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  standalone: false,
  selector: 'app-document-library-list',
  templateUrl: './document-library-list.component.html',
  styleUrls: ['./document-library-list.component.scss']
})
export class DocumentLibraryListComponent extends BaseComponent implements OnInit, AfterViewInit {
  dataSource: DocumentLibraryDataSource;
  documents: DocumentInfo[] = [];
  displayedColumns: string[] = ['action', 'name', 'categoryName', 'createdDate', 'expiredDate', 'createdBy'];
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
    private documentLibraryService: DocumentLibraryService,
    private categoryService: DocumentCategoryService,
    public overlay: OverlayPanel) {
    super();
    this.documentResource = new DocumentResource();
    this.documentResource.pageSize = 10;
    this.documentResource.orderBy = "CreatedDate desc";
  }

  ngOnInit(): void {
    this.dataSource = new DocumentLibraryDataSource(this.documentLibraryService);
    this.dataSource.loadDocuments(this.documentResource);
    this.sub$.sink = this.categoryService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getCategories();
          }
        })
      ).subscribe();
    this.sub$.sink = this.categoryService.entities$
      .subscribe(c => {
        this.categories = [...c];
      });
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sub$.sink = this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
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

  onCategoryChange(filtervalue: any) {
    if (filtervalue.value) {
      this.documentResource.categoryId = filtervalue.value;
    } else {
      this.documentResource.categoryId = '';
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

  getDocuments(): void {
    this.isLoadingResults = true;
    this.sub$.sink = this.documentLibraryService.getDocuments(this.documentResource)
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

  onDocumentView(document: DocumentInfo) {
    this.overlay.open(DocumentViewComponent, {
      position: 'center',
      origin: 'global',
      panelClass: ['file-preview-overlay-container', 'white-background'],
      data: { documentId: document.id, isRestricted: false }
    });
  }
}
