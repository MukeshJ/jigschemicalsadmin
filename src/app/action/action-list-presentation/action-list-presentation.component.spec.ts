import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionListPresentationComponent } from './action-list-presentation.component';

describe('ActionListPresentationComponent', () => {
  let component: ActionListPresentationComponent;
  let fixture: ComponentFixture<ActionListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
