import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationInputComponent } from './consultation-input.component';

describe('ConsultationInputComponent', () => {
  let component: ConsultationInputComponent;
  let fixture: ComponentFixture<ConsultationInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationInputComponent]
    });
    fixture = TestBed.createComponent(ConsultationInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
