import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadTodayComponent } from './bad-today.component';

describe('BadTodayComponent', () => {
  let component: BadTodayComponent;
  let fixture: ComponentFixture<BadTodayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadTodayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
