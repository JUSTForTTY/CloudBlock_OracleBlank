import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WoOrderInfoComponent } from './wo-order-info.component';

describe('WoOrderInfoComponent', () => {
  let component: WoOrderInfoComponent;
  let fixture: ComponentFixture<WoOrderInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WoOrderInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WoOrderInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
