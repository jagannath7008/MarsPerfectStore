import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderspendsComponent } from './traderspends.component';

describe('TraderspendsComponent', () => {
  let component: TraderspendsComponent;
  let fixture: ComponentFixture<TraderspendsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderspendsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderspendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
