import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectChartComponent } from './subject-chart.component';

describe('SubjectChartComponent', () => {
  let component: SubjectChartComponent;
  let fixture: ComponentFixture<SubjectChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectChartComponent]
    });
    fixture = TestBed.createComponent(SubjectChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
