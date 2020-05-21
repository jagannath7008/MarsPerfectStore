import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivetargetheaderComponent } from './incentivetargetheader.component';

describe('IncentivetargetheaderComponent', () => {
  let component: IncentivetargetheaderComponent;
  let fixture: ComponentFixture<IncentivetargetheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentivetargetheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentivetargetheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
