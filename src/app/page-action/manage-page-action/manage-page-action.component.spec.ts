import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePageActionComponent } from './manage-page-action.component';

describe('ManagePageActionComponent', () => {
  let component: ManagePageActionComponent;
  let fixture: ComponentFixture<ManagePageActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePageActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePageActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
