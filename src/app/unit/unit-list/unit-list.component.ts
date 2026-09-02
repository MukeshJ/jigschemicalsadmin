import { Component, OnInit } from '@angular/core';
import { Unit } from '@core/domain-classes/unit';
import { TranslationService } from '@core/services/translation.service';
import { UnitService } from '@core/services/unit.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { UnitListPresentationComponent } from '../unit-list-presentation/unit-list-presentation.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss'],
  imports: [UnitListPresentationComponent, AsyncPipe],
})
export class UnitListComponent extends BaseComponent implements OnInit {
  units$: Observable<Unit[]>;
  loading$: Observable<boolean>;
  constructor(
    private unitService: UnitService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.loading$ = this.unitService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.getUnits();
        }
      }),
    );
    this.units$ = this.unitService.entities$;
  }

  getUnits(): void {
    this.unitService.getAll();
  }

  deleteUnit(id: string): void {
    this.sub$.sink = this.unitService.delete(id).subscribe(() => {
      this.toastrService.success('Unit deleted Successfully');
    });
  }
}
