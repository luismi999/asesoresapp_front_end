import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserStudentComponent } from './view-user-student.component';

describe('ViewUserStudentComponent', () => {
  let component: ViewUserStudentComponent;
  let fixture: ComponentFixture<ViewUserStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserStudentComponent]
    });
    fixture = TestBed.createComponent(ViewUserStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
