import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DandEDumpComponent } from './dand-edump.component';

describe('DandEDumpComponent', () => {
  let component: DandEDumpComponent;
  let fixture: ComponentFixture<DandEDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DandEDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DandEDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
