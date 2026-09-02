import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePageActionPresentationComponent } from './manage-page-action-presentation.component';

describe('ManagePageActionPresentationComponent', () => {
  let component: ManagePageActionPresentationComponent;
  let fixture: ComponentFixture<ManagePageActionPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePageActionPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePageActionPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
