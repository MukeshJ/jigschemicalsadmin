import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { SecurityService } from '@core/security/security.service';
import { SupplierService } from '../supplier.service';

import { BulkUploadSupplierComponent } from './bulk-upload-supplier.component';

describe('BulkUploadSupplierComponent', () => {
  let component: BulkUploadSupplierComponent;
  let fixture: ComponentFixture<BulkUploadSupplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BulkUploadSupplierComponent],
      providers: [
        { provide: SupplierService, useValue: {} },
        { provide: ToastrService, useValue: { success: () => {}, error: () => {} } },
        { provide: SecurityService, useValue: { hasClaim: () => true } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadSupplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
