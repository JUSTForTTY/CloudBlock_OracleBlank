import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopBoardComponent } from './workshop-board.component';

describe('WorkshopBoardComponent', () => {
  let component: WorkshopBoardComponent;
  let fixture: ComponentFixture<WorkshopBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkshopBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkshopBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
