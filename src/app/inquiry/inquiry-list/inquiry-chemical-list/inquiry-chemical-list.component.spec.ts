import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryChemicalListComponent } from './inquiry-chemical-list.component';

describe('InquiryChemicalListComponent', () => {
  let component: InquiryChemicalListComponent;
  let fixture: ComponentFixture<InquiryChemicalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryChemicalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InquiryChemicalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
