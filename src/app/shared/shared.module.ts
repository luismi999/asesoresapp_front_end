import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Componentes
import { NavbarStudentComponent } from './navbar-student/navbar-student.component';
import { PagesRoutingModule } from '../pages/pages-routing.module';

@NgModule({
  declarations: [
    NavbarStudentComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ],
  exports: [
    NavbarStudentComponent,
  ]
})
export class SharedModule { }
