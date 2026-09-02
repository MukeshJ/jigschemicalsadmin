import { Injectable } from '@angular/core';
import {
  Resolve,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { ChemicalService } from '../chemical.service';
import { Observable, of } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { Chemical } from '@core/domain-classes/chemical';


@Injectable()
export class ChemicalDetailResolverService implements Resolve<Chemical> {
  constructor(private cs: ChemicalService, private router: Router) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Chemical> | null {
    const id = route.paramMap.get('id');
    if (id === 'add') {
      return null;
    }
    return this.cs.getChemical(id).pipe(
      take(1),
      mergeMap(chemical => {
        if (chemical) {
          return of(chemical);
        } else {
          this.router.navigate(['/chemical']);
          return null;
        }
      })
    );
  }
}
