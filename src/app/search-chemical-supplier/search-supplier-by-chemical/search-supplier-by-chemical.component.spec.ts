import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSupplierByChemicalComponent } from './search-supplier-by-chemical.component';

describe('SearchSupplierByChemicalComponent', () => {
  let component: SearchSupplierByChemicalComponent;
  let fixture: ComponentFixture<SearchSupplierByChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSupplierByChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSupplierByChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
