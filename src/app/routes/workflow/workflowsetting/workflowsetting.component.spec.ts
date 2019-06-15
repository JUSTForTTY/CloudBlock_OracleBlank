import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowsettingComponent } from './workflowsetting.component';

describe('WorkflowsettingComponent', () => {
  let component: WorkflowsettingComponent;
  let fixture: ComponentFixture<WorkflowsettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowsettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowsettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
