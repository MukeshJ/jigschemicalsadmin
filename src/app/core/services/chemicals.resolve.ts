import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Chemical } from '@core/domain-classes/chemical';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChemicalService } from 'src/app/chemical/chemical.service';

@Injectable({ providedIn: 'root' })
export class ChemicalsResolve implements Resolve<Chemical[] | null> {
  /**
   *
   */
  constructor(private chemicalService: ChemicalService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Chemical[]> | null  {
    const productResource= new ChemicalResourceParameter();
    return  this.chemicalService.getChemicals(productResource)
    .pipe(
      map((resp: HttpResponse<Chemical[]>) =>resp.body )
    )

  }
}
