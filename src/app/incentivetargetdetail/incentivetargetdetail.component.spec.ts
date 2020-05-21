import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivetargetdetailComponent } from './incentivetargetdetail.component';

describe('IncentivetargetdetailComponent', () => {
  let component: IncentivetargetdetailComponent;
  let fixture: ComponentFixture<IncentivetargetdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentivetargetdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivetargetdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
