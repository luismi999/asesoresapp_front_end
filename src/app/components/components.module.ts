import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ViewConsultationComponent } from './view-consultation/view-consultation.component';
import { ChartAdvisorComponent } from './chart-advisor/chart-advisor.component';
import { ViewUserAdvisorComponent } from './view-user-advisor/view-user-advisor.component';
import { ProgressBarConsultationsComponent } from './progress-bar-consultations/progress-bar-consultations.component';
import { RankComponent } from './rank/rank.component';
import { ReadExcelComponent } from './read-excel/read-excel.component';
import { MapComponent } from './map/map.component';
import { ViewUserStudentComponent } from './view-user-student/view-user-student.component';


@NgModule({
  declarations: [
    LoadingComponent,
    ViewConsultationComponent,
    ChartAdvisorComponent,
    ViewUserAdvisorComponent,
    ProgressBarConsultationsComponent,
    RankComponent,
    ReadExcelComponent,
    MapComponent,
    ViewUserStudentComponent
  ],
  imports: [
    CommonModule,
    PrimengModule
  ],
  exports: [
    LoadingComponent,
    ViewConsultationComponent,
    ChartAdvisorComponent,
    ViewUserAdvisorComponent,
    ProgressBarConsultationsComponent,
    RankComponent,
    ReadExcelComponent,
    MapComponent,
    ViewUserStudentComponent
  ]
})
export class ComponentsModule { }