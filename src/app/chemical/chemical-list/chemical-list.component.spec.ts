import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChemicalListComponent } from './chemical-list.component';

describe('ChemicalListComponent', () => {
  let component: ChemicalListComponent;
  let fixture: ComponentFixture<ChemicalListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChemicalListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChemicalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
