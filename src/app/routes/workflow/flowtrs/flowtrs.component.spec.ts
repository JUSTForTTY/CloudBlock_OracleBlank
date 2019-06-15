import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowtrsComponent } from './flowtrs.component';

describe('FlowtrsComponent', () => {
  let component: FlowtrsComponent;
  let fixture: ComponentFixture<FlowtrsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowtrsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowtrsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
