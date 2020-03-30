import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleTodayComponent } from './people-today.component';

describe('PeopleTodayComponent', () => {
  let component: PeopleTodayComponent;
  let fixture: ComponentFixture<PeopleTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeopleTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
