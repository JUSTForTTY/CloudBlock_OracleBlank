import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldDailyComponent } from './yield-daily.component';

describe('YieldDailyComponent', () => {
  let component: YieldDailyComponent;
  let fixture: ComponentFixture<YieldDailyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldDailyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
