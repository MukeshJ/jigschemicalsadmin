import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Article } from '@core/domain-classes/article';
import { ArticleResourceParameter } from '@core/domain-classes/article-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ArticleService } from '../article.service';
import { ArticleDataSource } from './article-datasource';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent extends BaseComponent implements OnInit {
  dataSource: ArticleDataSource;
  articles: Article[] = [];
  displayedColumns: string[] = ['action', 'title', 'shortDescription', 'createdDate', 'publishDate'];
  footerToDisplayed: string[] = ['footer'];
  isLoadingResults = true;
  articleResource: ArticleResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _titleFilter: string;
  _shortDescriptionFilter: string;
  public filterObservable$: Subject<string> = new Subject<string>();

  public get TitleFilter(): string {
    return this._titleFilter;
  }

  public set TitleFilter(v: string) {
    this._titleFilter = v;
    const titleFilter = `title:${v}`;
    this.filterObservable$.next(titleFilter);
  }

  public get ShortDescriptionFilter(): string {
    return this._shortDescriptionFilter;
  }
  public set ShortDescriptionFilter(v: string) {
    this._shortDescriptionFilter = v;
    const shortDescriptionFilter = `shortDescription:${v}`;
    this.filterObservable$.next(shortDescriptionFilter);
  }

  constructor(
    private articleService: ArticleService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private router: Router,
    private translationService: TranslationService) {
    super();
    this.articleResource = new ArticleResourceParameter();
    this.articleResource.pageSize = 15;
    this.articleResource.orderBy = 'createdDate desc'
  }

  ngOnInit(): void {
    this.dataSource = new ArticleDataSource(this.articleService);
    this.dataSource.loadData(this.articleResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.articleResource.skip = 0;
        const strArray: Array<string> = c.split(':');
        if (strArray[0] === 'title') {
          this.articleResource.title = escape(strArray[1]);
        } else if (strArray[0] === 'shortDescription') {
          this.articleResource.shortDescription = strArray[1];
        }
        this.dataSource.loadData(this.articleResource);
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap((c: any) => {
          this.articleResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.articleResource.pageSize = this.paginator.pageSize;
          this.articleResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.articleResource);
        })
      )
      .subscribe();
  }

  deleteArticle(article: Article) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')}?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.articleService.deleteArticle(article.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('ARTICLE_DELETED_SUCCESSFULLY'));
              this.paginator.pageIndex = 0;
              this.dataSource.loadData(this.articleResource);
            });
        }
      });
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.articleResource.pageSize = c.pageSize;
          this.articleResource.skip = c.skip;
          this.articleResource.totalCount = c.totalCount;
        }
      });
  }

  editArticle(articleId: string) {
    this.router.navigate(['/article/manage', articleId])
  }
}
