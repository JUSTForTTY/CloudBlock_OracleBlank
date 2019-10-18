import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProlineErrormsgComponent } from './proline-errormsg.component';

describe('ProlineErrormsgComponent', () => {
  let component: ProlineErrormsgComponent;
  let fixture: ComponentFixture<ProlineErrormsgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProlineErrormsgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProlineErrormsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
