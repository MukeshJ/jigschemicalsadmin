import { Service } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Service()
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }
}
