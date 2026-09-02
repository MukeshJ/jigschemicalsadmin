import { DataSource } from '@angular/cdk/table';
import { HttpResponse } from '@angular/common/http';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { Chemical } from '@core/domain-classes/chemical';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ChemicalService } from '../chemical.service';
import { ChemicalResourceParameter } from '@core/domain-classes/chemical-resource-parameter';

export class ChemicalDataSource implements DataSource<Chemical> {
  private _chemicalSubject$ = new BehaviorSubject<Chemical[]>([]);
  private _responseHeaderSubject$ = new BehaviorSubject<ResponseHeader>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  private _count: number = 0;
  sub$: Subscription;

  public get count(): number {
    return this._count;
  }
  public responseHeaderSubject$ = this._responseHeaderSubject$.asObservable();

  constructor(private chemicalService: ChemicalService) {
  }

  connect(): Observable<Chemical[]> {
    this.sub$ = new Subscription();
    return this._chemicalSubject$.asObservable();
  }

  disconnect(): void {
    this._chemicalSubject$.complete();
    this.loadingSubject.complete();
    this.sub$.unsubscribe();
  }

  loadData(chemicalResource: ChemicalResourceParameter) {
    this.loadingSubject.next(true);
    this.sub$ = this.chemicalService.getChemicals(chemicalResource)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false)))
      .subscribe((resp: HttpResponse<Chemical[]>) => {
        if (resp && resp.headers) {
          const paginationParam = JSON.parse(
            resp.headers.get('X-Pagination')
          ) as ResponseHeader;
          this._responseHeaderSubject$.next(paginationParam);
          const chemicals = [...resp.body];
          this._count = chemicals.length;
          this._chemicalSubject$.next(chemicals);
        }
      });
  }
}
