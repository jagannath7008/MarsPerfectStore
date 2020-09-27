import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RowdataComponent } from './rowdata.component';

describe('RowdataComponent', () => {
  let component: RowdataComponent;
  let fixture: ComponentFixture<RowdataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RowdataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RowdataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
