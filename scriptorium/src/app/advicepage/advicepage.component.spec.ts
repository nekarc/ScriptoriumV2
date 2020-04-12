import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvicepageComponent } from './advicepage.component';

describe('AdvicepageComponent', () => {
  let component: AdvicepageComponent;
  let fixture: ComponentFixture<AdvicepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvicepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvicepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
