import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalDetailComponent } from './chemical-detail.component';

describe('ChemicalDetailComponent', () => {
  let component: ChemicalDetailComponent;
  let fixture: ComponentFixture<ChemicalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
