import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gallery } from '@core/domain-classes/gallery';
import { GalleryResource } from '@core/domain-classes/gallery-resource';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  constructor(private httpClient: HttpClient) { }

  getGalleries(): Observable<Gallery[]> {
    return this.httpClient.get<Gallery[]>('EventGallery');
  }

  getGalleryList(resourceParams: GalleryResource): Observable<HttpResponse<Gallery[]>> {
    const url = 'EventGallery';
    const customParams = new HttpParams()
      .set('Fields', resourceParams.fields ? resourceParams.fields : '')
      .set('OrderBy', resourceParams.orderBy ? resourceParams.orderBy : '')
      .set('PageSize', resourceParams.pageSize.toString())
      .set('Skip', resourceParams.skip.toString())
      .set(
        'SearchQuery',
        resourceParams.searchQuery ? resourceParams.searchQuery : ''
      )
      .set('name', resourceParams.name ? resourceParams.name : '')
      .set(
        'category',
        resourceParams.category !== null && resourceParams.category !== undefined
          ? resourceParams.category
          : ''
      );

    return this.httpClient.get<Gallery[]>(url, {
      params: customParams,
      observe: 'response',
    });
  }

  getGalleryById(id: string): Observable<Gallery> {
    return this.httpClient.get<Gallery>(`EventGallery/${id}`);
  }

  saveGallery(gallery: Gallery) {
    return this.httpClient.post<Gallery>('EventGallery', gallery);
  }

  updateGallery(gallery: Gallery, id: string) {
    return this.httpClient.put<Gallery>(`EventGallery/${id}`, gallery);
  }

  deleteGallery(id: string) {
    return this.httpClient.delete<void>(`EventGallery/${id}`);
  }
}
