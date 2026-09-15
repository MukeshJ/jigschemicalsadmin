import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderAddEditComponent } from './sales-order-add-edit.component';

describe('SalesOrderAddEditComponent', () => {
  let component: SalesOrderAddEditComponent;
  let fixture: ComponentFixture<SalesOrderAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalesOrderAddEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the selected unit name from the mapped unit list', () => {
    component.unitsMap[0] = [{ id: 1, name: 'Kilogram' } as any];

    expect(component.getUnitNameById(1, 0)).toBe('Kilogram');
  });

  it('should return an empty value when the selected unit is not in the mapped list', () => {
    component.unitsMap[0] = [{ id: 1, name: 'Kilogram' } as any];

    expect(component.getUnitNameById(2, 0)).toBe('');
  });
});
