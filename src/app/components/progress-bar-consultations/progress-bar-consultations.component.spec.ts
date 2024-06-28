import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarConsultationsComponent } from './progress-bar-consultations.component';

describe('ProgressBarConsultationsComponent', () => {
  let component: ProgressBarConsultationsComponent;
  let fixture: ComponentFixture<ProgressBarConsultationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgressBarConsultationsComponent]
    });
    fixture = TestBed.createComponent(ProgressBarConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
