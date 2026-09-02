import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingTypeListComponent } from './packaging-type-list.component';

describe('PackagingTypeListComponent', () => {
  let component: PackagingTypeListComponent;
  let fixture: ComponentFixture<PackagingTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagingTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
