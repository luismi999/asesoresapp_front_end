import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

/* Componentes */
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

/* Modulos */
import { PrimengModule } from '../primeng/primeng.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    SignUpComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    PrimengModule,
    ComponentsModule
  ],
  exports: [ AuthComponent ]
})
export class AuthModule { }
