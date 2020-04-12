import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddbookpageComponent } from './addbookpage.component';

describe('AddbookpageComponent', () => {
  let component: AddbookpageComponent;
  let fixture: ComponentFixture<AddbookpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddbookpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddbookpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
