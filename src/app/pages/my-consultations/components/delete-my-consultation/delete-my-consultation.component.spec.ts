import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMyConsultationComponent } from './delete-my-consultation.component';

describe('DeleteConsultationComponent', () => {
  let component: DeleteMyConsultationComponent;
  let fixture: ComponentFixture<DeleteMyConsultationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteMyConsultationComponent]
    });
    fixture = TestBed.createComponent(DeleteMyConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
