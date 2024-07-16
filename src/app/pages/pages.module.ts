import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Componentes */
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';

/* Modulos */
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MyConsultationsComponent } from './my-consultations/my-consultations.component';
import { PrimengModule } from '../primeng/primeng.module';
import { ConsultationsComponent } from './consultations/consultations.component';
import { MyJoinsComponent } from './my-joins/my-joins.component';
import { ConsultationsMapComponent } from './consultations-map/consultations-map.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { ComponentsModule } from '../components/components.module';
import { AdminConsultationsComponent } from './admin-consultations/admin-consultations.component';
import { AdminSubjectsComponent } from './admin-subjects/admin-subjects.component';
import { ViewJoinsComponent } from './my-consultations/components/view-joins/view-joins.component';
import { CreateConsultationComponent } from './my-consultations/components/create-consultation/create-consultation.component';
import { GradeJoinComponent } from './my-joins/components/grade-join/grade-join.component';
import { ChartUsersComponent } from './admin-users/components/chart-users/chart-users.component';
import { ChartConsultationsComponent } from './admin-consultations/components/chart-consultations/chart-consultations.component';
import { CreateSubjectComponent } from './admin-subjects/components/create-subject/create-subject.component';
import { SubjectChartComponent } from './admin-subjects/components/subject-chart/subject-chart.component';
import { DeleteSubjectComponent } from './admin-subjects/components/delete-subject/delete-subject.component';
import { UserSelectorComponent } from './admin-users/components/user-selector/user-selector.component';
import { UserInputComponent } from './admin-users/components/user-input/user-input.component';
import { DeleteUserComponent } from './admin-users/components/delete-user/delete-user.component';
import { ConsultationSelectorComponent } from './admin-consultations/components/consultation-selector/consultation-selector.component';
import { ConsultationInputComponent } from './admin-consultations/components/consultation-input/consultation-input.component';
import { AdvisorJoinsComponent } from './advisor-joins/advisor-joins.component';
import { DeleteConsultationComponent } from './admin-consultations/components/delete-consultation/delete-consultation.component';
import { DeleteMyConsultationComponent } from './my-consultations/components/delete-my-consultation/delete-my-consultation.component';
import { FinishJoinComponent } from './advisor-joins/components/finish-join/finish-join.component';

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
    AdvisorJoinsComponent,
    ProfileComponent,
    MyConsultationsComponent,
    ConsultationsComponent,
    MyJoinsComponent,
    ConsultationsMapComponent,
    StatisticsComponent,
    AdminUsersComponent,
    AdminConsultationsComponent,
    AdminSubjectsComponent,
    ViewJoinsComponent,
    CreateConsultationComponent,
    GradeJoinComponent,
    ChartUsersComponent,
    ChartConsultationsComponent,
    CreateSubjectComponent,
    SubjectChartComponent,
    StatisticsComponent,
    DeleteSubjectComponent,
    UserSelectorComponent,
    UserInputComponent,
    DeleteUserComponent,
    ConsultationSelectorComponent,
    ConsultationInputComponent,
    DeleteConsultationComponent,
    DeleteMyConsultationComponent,
    FinishJoinComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    PrimengModule,
    ComponentsModule
  ]
})
export class PagesModule { }
