import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadbudgetplanComponent } from './uploadbudgetplan.component';

describe('UploadbudgetplanComponent', () => {
  let component: UploadbudgetplanComponent;
  let fixture: ComponentFixture<UploadbudgetplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadbudgetplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadbudgetplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
