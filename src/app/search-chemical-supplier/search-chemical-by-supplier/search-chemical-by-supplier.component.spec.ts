import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchChemicalBySupplierComponent } from './search-chemical-by-supplier.component';

describe('SearchChemicalBySupplierComponent', () => {
  let component: SearchChemicalBySupplierComponent;
  let fixture: ComponentFixture<SearchChemicalBySupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchChemicalBySupplierComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchChemicalBySupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
