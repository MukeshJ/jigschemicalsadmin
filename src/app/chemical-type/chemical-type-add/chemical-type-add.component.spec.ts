import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalTypeAddComponent } from './chemical-type-add.component';

describe('ChemicalTypeAddComponent', () => {
  let component: ChemicalTypeAddComponent;
  let fixture: ComponentFixture<ChemicalTypeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChemicalTypeAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalTypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
