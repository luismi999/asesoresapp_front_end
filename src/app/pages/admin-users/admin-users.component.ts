import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

// Modelos 
import { User } from 'src/app/model/user.model';

// Servicios 
import { ConfirmationService, MessageService } from 'primeng/api';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from '../../services/auth.service';

// Componentes hijos 
import { ViewUserAdvisorComponent } from 'src/app/components/view-user-advisor/view-user-advisor.component';
import { ViewUserStudentComponent } from '../../components/view-user-student/view-user-student.component';
import { UserSelectorComponent } from './components/user-selector/user-selector.component';
import { UpdateUserResponse } from 'src/app/model/updateUserResponse.interface';
import { DeleteUserResponse } from 'src/app/model/deleteUserResponse.interface';
import { DeleteUserComponent } from './components/delete-user/delete-user.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class AdminUsersComponent {

  @ViewChild(ViewUserAdvisorComponent) viewUserAdvisorComponent!: ViewUserAdvisorComponent;
  @ViewChild(ViewUserStudentComponent) ViewUserStudentComponent!: ViewUserStudentComponent;
  @ViewChild(UserSelectorComponent) userSelectorComponent!: UserSelectorComponent;
  @ViewChild(DeleteUserComponent) deleteUserComponent!: DeleteUserComponent;

  // Propiedades
  my_user       ?: User;
  users         ?: User[] = [];
  form          !: FormGroup;

  // Banderas
  flag_show_view_user_advisor  : boolean = false;
  flag_show_view_user_student  : boolean = false;
  loading_flag                 : boolean = false;

  // Suscripciones 
  sub_user_find_one?: Subscription;
  sub_user_find_all?: Subscription;
  sub_user_update  ?: Subscription;

  // Constructor
  constructor(
    private fb                 : FormBuilder,
    private AuthService        : AuthService,
    private messageService     : MessageService,
    private usersService       : UsersService){}

  // Inicializado 
  ngOnInit(): void{
    this.my_user = this.AuthService.getUser();
    this.get_users();
    this.start_form();
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_user_find_one?.unsubscribe();
    this.sub_user_find_all?.unsubscribe();
    this.sub_user_update?.unsubscribe();
  }

  // Inicializar formulario 
  start_form(): void{
    // Formulario para cambiar el estado
    this.form = this.fb.group({
      role: ['']
    });
  }
  
  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones para la tabla de usuarios - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Obtener usuarios 
  get_users(): void{
    // Cargando 
    this.loading_flag = true;
    // Borramos los usuarios existentes 
    this.users = [];
    // Consultamos el servicio de USERS 
    this.sub_user_find_one = this.usersService.findAll().subscribe({
      next: (resp: User[]) => {
        // Guardamos los usuarios 
        resp.map((user: User) => {
          if(user.role == 'advisor')
            this.users?.push(user);
        });
        // Cargando 
        this.loading_flag = false;
      },
      error: (error) => {
        // Respuesta del backend 
        console.log(error.error.message);
        // Cargando 
        this.loading_flag = false;
      }
    });
  }

  // Actualizaremos solo el status del usuario 
  update_user_active(user: User, event: any): void{
    // Cargando
    this.loading_flag = true;
    // Guardamos le valor en una variable 
    const data: any = {isActive: event.srcElement.checked}; 
    // Consultamos al servicio de USERS 
    this.sub_user_update = this.usersService.update(user.uuid, data).subscribe({
      next: (resp: UpdateUserResponse) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Cargando
        this.loading_flag = false;
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Cargando
        this.loading_flag = false;
      }
    });
  }

  // Actualizaremos solo el status del usuario 
  update_role(user: User): void{
    // Cargando 
    this.loading_flag = true;
    // Consultamos al servicio de USERS 
    this.sub_user_update = this.usersService.update(user.uuid, this.form.value).subscribe({
      next: (resp: UpdateUserResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Cargando 
        this.loading_flag = false;
      },
      error: (error) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Cargando 
        this.loading_flag = false;
      }
    });
  }

  //  ---------------------------------------------------------------------------- Componente hijo (view user) ---------------------------------------------------------------------
  show_modal_view_user(user: User): void{
    // Buscamos el usuario desde el componente hijo 
    if(user.role == 'advisor'){
      // Bandera 
      this.flag_show_view_user_advisor = true;
      this.viewUserAdvisorComponent.findUser(user.uuid);
    }
    else if(user.role == 'student' || user.role == 'admin'){
      // Bandera 
      this.flag_show_view_user_student = true;
      this.ViewUserStudentComponent.findUser(user.uuid);
    }
  }

  // ---------------------------------------------------------------------------- Componente hijo (delete user) ------------------------------------------------------------------- 
  show_modal_delete_user(user: User) {
    this.deleteUserComponent.start_component(user);
  }
}