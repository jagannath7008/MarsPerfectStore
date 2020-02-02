import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanogramsecondaryvisibilityComponent } from './planogramsecondaryvisibility.component';

describe('PlanogramsecondaryvisibilityComponent', () => {
  let component: PlanogramsecondaryvisibilityComponent;
  let fixture: ComponentFixture<PlanogramsecondaryvisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanogramsecondaryvisibilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramsecondaryvisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
