import { Directive, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';

@Directive()
export class BaseComponent implements OnDestroy {
    sub$: SubSink;
    constructor() {
        this.sub$ = new SubSink();
    }
    ngOnDestroy(): void {
        this.sub$.unsubscribe();
    }
}
