import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { Article } from '@core/domain-classes/article';
import { ArticleResourceParameter } from '@core/domain-classes/article-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ArticleService } from '../article.service';

export class ArticleDataSource implements DataSource<Article> {
    private _articleSubject$ = new BehaviorSubject<Article[]>([]);
    private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);

    private _count: number = 0;
    sub$: Subscription;

    public get count(): number {
        return this._count;
    }
    public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

    constructor(private articleService: ArticleService) {
    }

    connect(): Observable<Article[]> {
        this.sub$ = new Subscription();
        return this._articleSubject$.asObservable();
    }

    disconnect(): void {
        this._articleSubject$.complete();
        this.sub$.unsubscribe();
    }

    loadData(articleResource: ArticleResourceParameter) {
        this.sub$ = this.articleService.getArticles(articleResource)
            .pipe(
                catchError(() => of([])),)
            .subscribe((resp: HttpResponse<Article[]>) => {
                const paginationParam = JSON.parse(
                    resp.headers.get('X-Pagination')
                ) as ResponseHeader;
                this._responseHeaderSubject$.next(paginationParam);
                const articles = [...resp.body];
                this._count = articles.length;
                this._articleSubject$.next(articles);
            });
    }
}
