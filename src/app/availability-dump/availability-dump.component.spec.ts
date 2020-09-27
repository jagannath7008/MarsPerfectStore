import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityDumpComponent } from './availability-dump.component';

describe('AvailabilityDumpComponent', () => {
  let component: AvailabilityDumpComponent;
  let fixture: ComponentFixture<AvailabilityDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
