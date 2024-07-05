import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadExcelComponent } from './read-excel.component';

describe('ReadExcelComponent', () => {
  let component: ReadExcelComponent;
  let fixture: ComponentFixture<ReadExcelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReadExcelComponent]
    });
    fixture = TestBed.createComponent(ReadExcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
