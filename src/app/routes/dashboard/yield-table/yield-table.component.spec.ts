import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldTableComponent } from './yield-table.component';

describe('YieldTableComponent', () => {
  let component: YieldTableComponent;
  let fixture: ComponentFixture<YieldTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
