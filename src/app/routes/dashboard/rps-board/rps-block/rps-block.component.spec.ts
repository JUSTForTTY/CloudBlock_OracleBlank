import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RpsBlockComponent } from './rps-block.component';

describe('RpsBlockComponent', () => {
  let component: RpsBlockComponent;
  let fixture: ComponentFixture<RpsBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RpsBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RpsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
