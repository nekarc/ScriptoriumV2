import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookpageComponent } from './bookpage.component';

describe('BookpageComponent', () => {
  let component: BookpageComponent;
  let fixture: ComponentFixture<BookpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
