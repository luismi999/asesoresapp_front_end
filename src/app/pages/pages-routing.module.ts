import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/* Guardias */
import { AuthGuard } from '../guards/auth.guard';
import { StudentGuard } from '../guards/student.guard';

/* Componentes */
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { ProfileComponent } from './profile/profile.component';
import { MyConsultationsComponent } from './my-consultations/my-consultations.component';
import { ConsultationsComponent } from './consultations/consultations.component';
import { MyJoinsComponent } from './my-joins/my-joins.component';
import { ConsultationsMapComponent } from './consultations-map/consultations-map.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminConsultationsComponent } from './admin-consultations/admin-consultations.component';
import { AdminSubjectsComponent } from './admin-subjects/admin-subjects.component';
import { AdvisorGuard } from '../guards/advisor.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdvisorJoinsComponent } from './advisor-joins/advisor-joins.component';

const routes: Routes = [
  { path: "", component: PagesComponent, children: [
    // Todos 
    { path: "", canActivate:[AuthGuard], component: HomeComponent },
    { path: "profile", canActivate:[AuthGuard], component: ProfileComponent},
    { path: "consultationsMap", canActivate:[AuthGuard], component: ConsultationsMapComponent},
    // Asesor 
    { path: "myConsultations", canActivate:[AuthGuard, AdvisorGuard], component: MyConsultationsComponent},
    { path: "statistics", canActivate:[AuthGuard, AdvisorGuard], component: StatisticsComponent},
    { path: "joins/:uuid", canActivate:[AuthGuard, AdvisorGuard], component: AdvisorJoinsComponent},
    // Estudiante 
    { path: "consultations", canActivate:[AuthGuard, StudentGuard], component: ConsultationsComponent},
    { path: "myJoins", canActivate:[AuthGuard, StudentGuard], component: MyJoinsComponent},
    // Administrador 
    { path: "adminUsers", canActivate:[AuthGuard, AdminGuard], component: AdminUsersComponent },
    { path: "adminConsultations", canActivate:[AuthGuard, AdminGuard], component: AdminConsultationsComponent },
    { path: "adminSubjects", canActivate:[AuthGuard, AdminGuard], component: AdminSubjectsComponent }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
