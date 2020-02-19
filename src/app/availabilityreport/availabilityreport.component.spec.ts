import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityreportComponent } from './availabilityreport.component';

describe('AvailabilityreportComponent', () => {
  let component: AvailabilityreportComponent;
  let fixture: ComponentFixture<AvailabilityreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailabilityreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
