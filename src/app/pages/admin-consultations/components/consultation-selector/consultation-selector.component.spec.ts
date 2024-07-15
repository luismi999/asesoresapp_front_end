import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationSelectorComponent } from './consultation-selector.component';

describe('ConsultationSelectorComponent', () => {
  let component: ConsultationSelectorComponent;
  let fixture: ComponentFixture<ConsultationSelectorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationSelectorComponent]
    });
    fixture = TestBed.createComponent(ConsultationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
