import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Gallery } from '@core/domain-classes/gallery';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { GalleryService } from '../gallery.service';

@Injectable({ providedIn: 'root' })
export class GalleryResolverService implements Resolve<Gallery> {
  constructor(
    private galleryService: GalleryService,
    private router: Router) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Gallery> | null {
    const id = route.paramMap.get('id');
    if (id === 'addItem') {
      return null;
    }
    return this.galleryService.getGalleryById(id).pipe(
      take(1),
      mergeMap(gallery => {
        if (gallery) {
          return of(gallery);
        } else {
          this.router.navigate(['/gallery']);
          return null;
        }
      })
    );
  }
}
