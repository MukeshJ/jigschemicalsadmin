import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadChemicalComponent } from './bulk-upload-chemical.component';

describe('BulkUploadChemicalComponent', () => {
  let component: BulkUploadChemicalComponent;
  let fixture: ComponentFixture<BulkUploadChemicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkUploadChemicalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadChemicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
