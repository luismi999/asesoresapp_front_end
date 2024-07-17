import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartConsultationsStudentComponent } from './chart-consultations-student.component';

describe('ChartConsultationsStudentComponent', () => {
  let component: ChartConsultationsStudentComponent;
  let fixture: ComponentFixture<ChartConsultationsStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartConsultationsStudentComponent]
    });
    fixture = TestBed.createComponent(ChartConsultationsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
