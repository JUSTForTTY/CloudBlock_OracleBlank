import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicworkflowComponent } from './publicworkflow.component';

describe('PublicworkflowComponent', () => {
  let component: PublicworkflowComponent;
  let fixture: ComponentFixture<PublicworkflowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicworkflowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicworkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
