import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Industry } from '@core/domain-classes/industry';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { IndustryService } from '../industry.service';

@Injectable({ providedIn: 'root' })
export class IndustryResolverService implements Resolve<Industry> {
  constructor(
    private industryService: IndustryService,
    private router: Router) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Industry> | null {
    const id = route.paramMap.get('id');
    if (id === 'addItem') {
      return null;
    }
    return this.industryService.getIndustryById(id).pipe(
      take(1),
      mergeMap(industry => {
        if (industry) {
          return of(industry);
        } else {
          this.router.navigate(['/industry']);
          return null;
        }
      })
    );
  }
}
