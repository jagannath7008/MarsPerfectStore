import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAndCallComplianceDumpComponent } from './attendance-and-call-compliance-dump.component';

describe('AttendanceAndCallComplianceDumpComponent', () => {
  let component: AttendanceAndCallComplianceDumpComponent;
  let fixture: ComponentFixture<AttendanceAndCallComplianceDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendanceAndCallComplianceDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendanceAndCallComplianceDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
