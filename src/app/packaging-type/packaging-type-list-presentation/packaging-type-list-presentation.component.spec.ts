import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingTypeListPresentationComponent } from './packaging-type-list-presentation.component';

describe('PackagingTypeListPresentationComponent', () => {
  let component: PackagingTypeListPresentationComponent;
  let fixture: ComponentFixture<PackagingTypeListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagingTypeListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingTypeListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
