import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeatPlanningComponent } from './beat-planning.component';

describe('BeatPlanningComponent', () => {
  let component: BeatPlanningComponent;
  let fixture: ComponentFixture<BeatPlanningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeatPlanningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeatPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
