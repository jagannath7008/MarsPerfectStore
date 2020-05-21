import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotiondetailComponent } from './promotiondetail.component';

describe('PromotiondetailComponent', () => {
  let component: PromotiondetailComponent;
  let fixture: ComponentFixture<PromotiondetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotiondetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotiondetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
