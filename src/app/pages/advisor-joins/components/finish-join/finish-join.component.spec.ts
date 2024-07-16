import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishJoinComponent } from './finish-join.component';

describe('FinishJoinComponent', () => {
  let component: FinishJoinComponent;
  let fixture: ComponentFixture<FinishJoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FinishJoinComponent]
    });
    fixture = TestBed.createComponent(FinishJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
