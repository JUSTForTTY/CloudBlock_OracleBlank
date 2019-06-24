import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TasktimeComponent } from './tasktime.component';

describe('TasktimeComponent', () => {
  let component: TasktimeComponent;
  let fixture: ComponentFixture<TasktimeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TasktimeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TasktimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
