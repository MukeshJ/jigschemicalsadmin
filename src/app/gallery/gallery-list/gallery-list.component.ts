import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Gallery } from '@core/domain-classes/gallery';
import { BaseComponent } from 'src/app/base.component';
import { GalleryService } from '../gallery.service';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatFooterCellDef,
  MatFooterCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';
import { galleryCategories, GalleryCategoryEnum } from '../categories-enum';
import { GalleryResource } from '@core/domain-classes/gallery-resource';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { merge, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, tap } from 'rxjs/operators';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSelect, MatOption } from '@angular/material/select';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { GalleryCategoryPipe } from '@shared/pipes/gallery-category.pipe';

@Component({
  selector: 'app-gallery-list',
  templateUrl: './gallery-list.component.html',
  styleUrls: ['./gallery-list.component.scss'],
  imports: [
    HasClaimDirective,
    RouterLink,
    NgIf,
    MatProgressSpinner,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatSortHeader,
    FormsModule,
    MatSelect,
    MatOption,
    NgFor,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    UTCToLocalTime,
    TranslatePipe,
    GalleryCategoryPipe,
  ],
})
export class GalleryListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['action', 'name', 'category', 'createdDate'];
  footerToDisplayed = ['footer'];
  dataSource: MatTableDataSource<Gallery> = new MatTableDataSource<Gallery>([]);
  galleryResource: GalleryResource;
  isLoading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  galleryCategories = galleryCategories;
  _nameFilter: string;
  _categoryFilter: GalleryCategoryEnum | null = null;
  public filterObservable$: Subject<string> = new Subject<string>();

  public get NameFilter(): string {
    return this._nameFilter;
  }
  public set NameFilter(v: string) {
    this._nameFilter = v;
    const nameFilter = `name:${v}`;
    this.filterObservable$.next(nameFilter);
  }

  public get CategoryFilter(): GalleryCategoryEnum | null {
    return this._categoryFilter;
  }
  public set CategoryFilter(v: GalleryCategoryEnum | null) {
    this._categoryFilter = v;
    const categoryFilter = `category:${v}`;
    this.filterObservable$.next(categoryFilter);
  }

  constructor(
    private galleryService: GalleryService,
    private commonDialogService: CommonDialogService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
  ) {
    super();
    this.galleryResource = new GalleryResource();
    this.galleryResource.pageSize = 15;
    this.galleryResource.orderBy = 'createdDate desc';
  }

  ngOnInit(): void {
    this.loadGalleries();
    this.sub$.sink = this.filterObservable$
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((c) => {
        this.galleryResource.skip = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'name') {
          this.galleryResource.name = strArray[1];
        } else if (strArray[0] === 'category') {
          this.galleryResource.category =
            strArray[1] === 'null' || strArray[1] === '' ? null : +strArray[1];
        }
        this.loadGalleries();
      });
  }

  ngAfterViewInit() {
    this.sub$.sink = this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.galleryResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.galleryResource.pageSize = this.paginator.pageSize;
          this.galleryResource.orderBy = this.sort.active
            ? this.sort.active + ' ' + this.sort.direction
            : '';
          this.loadGalleries();
        }),
      )
      .subscribe();
  }

  loadGalleries() {
    this.isLoading = true;
    this.sub$.sink = this.galleryService
      .getGalleryList(this.galleryResource)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(
        (resp: HttpResponse<Gallery[]>) => {
          const header = resp.headers.get('X-Pagination');
          if (header) {
            const paginationParam = JSON.parse(header) as ResponseHeader;
            this.galleryResource.pageSize = paginationParam.pageSize;
            this.galleryResource.skip = paginationParam.skip;
            this.galleryResource.totalCount = paginationParam.totalCount;
          }
          this.dataSource.data = resp.body || [];
        },
        () => (this.isLoading = false),
      );
  }

  deleteGallery(gallery: Gallery) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${gallery.name}`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.galleryService.deleteGallery(gallery.id).subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('GALLERY_DELETED_SUCCESSFULLY'),
            );
            this.paginator.pageIndex = 0;
            this.loadGalleries();
          });
        }
      });
  }
}
