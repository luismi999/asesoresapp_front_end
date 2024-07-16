import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationSelectorStudentComponent } from './consultation-selector-student.component';

describe('ConsultationSelectorStudentComponent', () => {
  let component: ConsultationSelectorStudentComponent;
  let fixture: ComponentFixture<ConsultationSelectorStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationSelectorStudentComponent]
    });
    fixture = TestBed.createComponent(ConsultationSelectorStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
