import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadChemicalComponent } from './upload-chemical.component';

describe('UploadChemicalComponent', () => {
  let component: UploadChemicalComponent;
  let fixture: ComponentFixture<UploadChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
