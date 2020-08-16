import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfectstoreComponent } from './perfectstore.component';

describe('PerfectstoreComponent', () => {
  let component: PerfectstoreComponent;
  let fixture: ComponentFixture<PerfectstoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfectstoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfectstoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
