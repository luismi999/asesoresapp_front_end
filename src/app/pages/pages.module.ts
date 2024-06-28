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

@NgModule({
  declarations: [
    PagesComponent,
    HomeComponent,
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
    ChartConsultationsComponent
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
