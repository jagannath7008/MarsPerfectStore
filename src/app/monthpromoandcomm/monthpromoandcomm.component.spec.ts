import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthpromoandcommComponent } from './monthpromoandcomm.component';

describe('MonthpromoandcommComponent', () => {
  let component: MonthpromoandcommComponent;
  let fixture: ComponentFixture<MonthpromoandcommComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthpromoandcommComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthpromoandcommComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
