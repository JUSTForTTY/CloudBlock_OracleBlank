import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldDashboardComponent } from './yield-dashboard.component';

describe('YieldDashboardComponent', () => {
  let component: YieldDashboardComponent;
  let fixture: ComponentFixture<YieldDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
