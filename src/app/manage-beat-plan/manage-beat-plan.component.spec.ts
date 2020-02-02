import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBeatPlanComponent } from './manage-beat-plan.component';

describe('ManageBeatPlanComponent', () => {
  let component: ManageBeatPlanComponent;
  let fixture: ComponentFixture<ManageBeatPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageBeatPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageBeatPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
