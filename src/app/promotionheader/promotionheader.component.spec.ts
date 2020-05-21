import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionheaderComponent } from './promotionheader.component';

describe('PromotionheaderComponent', () => {
  let component: PromotionheaderComponent;
  let fixture: ComponentFixture<PromotionheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
