import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryRoutingComponent } from './industry-routing.component';

describe('IndustryRoutingComponent', () => {
  let component: IndustryRoutingComponent;
  let fixture: ComponentFixture<IndustryRoutingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustryRoutingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
