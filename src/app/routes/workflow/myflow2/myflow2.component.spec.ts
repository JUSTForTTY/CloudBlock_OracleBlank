import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Myflow2Component } from './myflow2.component';

describe('Myflow2Component', () => {
  let component: Myflow2Component;
  let fixture: ComponentFixture<Myflow2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Myflow2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Myflow2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
