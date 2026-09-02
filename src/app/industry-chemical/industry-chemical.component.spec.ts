import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryChemicalComponent } from './industry-chemical.component';

describe('IndustryChemicalComponent', () => {
  let component: IndustryChemicalComponent;
  let fixture: ComponentFixture<IndustryChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustryChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
