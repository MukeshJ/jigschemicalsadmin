import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '@core/domain-classes/article';
import { ArticleCategory } from '@core/domain-classes/article-category';
import { ArticleResourceParameter } from '@core/domain-classes/article-resource-parameter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private httpClient: HttpClient) { }

  getArticles(
    resourceParams: ArticleResourceParameter
  ): Observable<HttpResponse<Article[]>> {
    const url = 'article';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields ? resourceParams.fields : '')
      .set('OrderBy', resourceParams.orderBy ? resourceParams.orderBy : '')
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set(
        'SearchQuery',
        resourceParams.searchQuery ? resourceParams.searchQuery : ''
      )
      .set(
        'title',
        resourceParams.title ? resourceParams.title : ''
      )
      .set('shortDescription', resourceParams.shortDescription ? resourceParams.shortDescription : '');
    return this.httpClient.get<Article[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getArticle(id: string): Observable<Article> {
    const url = 'article/' + id;
    return this.httpClient.get<Article>(url);
  }

  deleteArticle(id: string): Observable<void> {
    const url = `article/${id}`;
    return this.httpClient.delete<void>(url);
  }

  updateArticle(id: string, supplier: Article): Observable<Article> {
    const url = 'article/' + id;
    return this.httpClient.put<Article>(url, supplier);
  }

  saveArticle(supplier: Article): Observable<Article> {
    const url = 'article';
    return this.httpClient.post<Article>(url, supplier);
  }

  getArticleCategories() {
    const url = 'article/getArticleCategories';
    return this.httpClient.get<ArticleCategory[]>(url);
  }
}
