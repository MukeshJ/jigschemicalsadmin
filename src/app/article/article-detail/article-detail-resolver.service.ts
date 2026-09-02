import { Injectable } from '@angular/core';
import {
    Resolve,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
} from '@angular/router';
import { Article } from '@core/domain-classes/article';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { ArticleService } from '../article.service';


@Injectable({
  providedIn: 'root'
})
export class ArticleDetailResolverService implements Resolve<Article> {
    constructor(
        private articleService: ArticleService,
        private router: Router
    ) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Article> | null {
        const id = route.paramMap.get('id');
        if (id === 'addItem') {
            return null;
        }
        return this.articleService.getArticle(id).pipe(
            take(1),
            mergeMap((article) => {
                if (article) {
                    return of(article);
                } else {
                    this.router.navigate(['/article']);
                    return null;
                }
            })
        );
    }
}
