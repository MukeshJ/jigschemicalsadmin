import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePackagingTypeComponent } from './manage-packaging-type.component';

describe('ManagePackagingTypeComponent', () => {
  let component: ManagePackagingTypeComponent;
  let fixture: ComponentFixture<ManagePackagingTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePackagingTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePackagingTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
