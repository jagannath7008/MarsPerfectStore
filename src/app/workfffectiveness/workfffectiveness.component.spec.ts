import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkfffectivenessComponent } from './workfffectiveness.component';

describe('WorkfffectivenessComponent', () => {
  let component: WorkfffectivenessComponent;
  let fixture: ComponentFixture<WorkfffectivenessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkfffectivenessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkfffectivenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
