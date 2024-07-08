import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

// Modelos 
import { User } from 'src/app/model/user.model';

// Servicios 
import { AuthService } from '../../services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// Componentes hijos 
import { ViewUserAdvisorComponent } from 'src/app/components/view-user-advisor/view-user-advisor.component';
import { Subscription } from 'rxjs';
import { UpdateUserResponse } from 'src/app/model/updateUserResponse.interface';
import { DeleteUserResponse } from 'src/app/model/deleteUserResponse.interface';
import { ViewUserStudentComponent } from '../../components/view-user-student/view-user-student.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class AdminUsersComponent {

  @ViewChild(ViewUserAdvisorComponent) viewUserAdvisorComponent!: ViewUserAdvisorComponent;
  @ViewChild(ViewUserStudentComponent) ViewUserStudentComponent!: ViewUserStudentComponent;

  // Propiedades
  my_user       ?: User;
  users         ?: User[] = [];
  advisors      ?: User[] = [];
  students      ?: User[] = [];
  filtered_users?: User[] = [];
  form1         !: FormGroup;
  form2         !: FormGroup;
  
  // Banderas
  flag_show_delete_user        : boolean = false;
  flag_show_view_user_advisor  : boolean = false;
  flag_show_view_user_student  : boolean = false;
  flag_loading                 : boolean = false;

  // Suscripciones 
  sub_user_find_one?: Subscription;
  sub_user_find_all?: Subscription;
  sub_user_update  ?: Subscription;
  sub_user_delete  ?: Subscription;

  // Constructor
  constructor(
    private fb                 : FormBuilder,
    private AuthService        : AuthService,
    private confirmationService: ConfirmationService,
    private messageService     : MessageService,
    private usersService       : UsersService){}

  // Inicializado 
  ngOnInit(): void{
    this.my_user = this.AuthService.getUser();
    this.getUsers();
    this.initForms();
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_user_find_one?.unsubscribe();
    this.sub_user_find_all?.unsubscribe();
    this.sub_user_update?.unsubscribe();
    this.sub_user_delete?.unsubscribe();
  }

  // Inicializar formulario 
  initForms(): void{
    // Formulario para cambiar el estado
    this.form1 = this.fb.group({
      role: ['']
    });
  }
  
  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones para la tabla de usuarios - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Obtener usuarios 
  getUsers(): void{
    // loading 
    this.flag_loading = true;
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
        // loading 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta del backend 
        console.log(error.error.message);
        // loading 
        this.flag_loading = false;
      }
    });
  }

  // Obtenemos los usuarios por role 
  getUsersBySelected(event: any): void{
    // loading 
    this.flag_loading = true;
    // Reiniciamos los usuarios 
    this.users = [];
    // Creamos una variable donde guardamos el valor del evento 
    const role = event.target.value;
    // Consultamos al servicio de USERS 
    this.sub_user_find_all = this.usersService.findAll().subscribe({
      next: (resp: User[]) => {
        // Guardamos los usuarios 
        resp.map((user: User) => {
          if(user.role == role)
            this.users?.push(user);
        });
        // loading 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta del backend 
        console.log(error.error.message);
        // loading 
        this.flag_loading = false;
      }
    })
  }

  // Obtener usuario por código institucional 
  getUserByInstitutionalCode(event: any){
    // Bandera 
    this.flag_loading = true;
    // Guardamos el valor del evento 
    const institutionalCode: string = event.target.value;
    // Reiniciamos usuarios 
    this.users = [];
    // Consultamos al servicio de USERS 
    this.usersService.findAll()
    .subscribe({
      next: (resp: User[]) => {
        // Mapeamos la respuesta 
        resp.map((user: User) => {
          if(user.institutional_code == institutionalCode)
            this.users?.push(user);
        });
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta del backend 
        console.log(error.error.message);
        // loading 
        this.flag_loading = false;
      }
    });
  }

  // Actualizaremos solo el status del usuario 
  updateIsActive(user: User, event: any): void{
    // loading 
    this.flag_loading = true;
    // Guardamos le valor en una variable 
    const data: any = {isActive: event.srcElement.checked}; 
    // Consultamos al servicio de USERS 
    this.sub_user_update = this.usersService.update(user.uuid, data).subscribe({
      next: (resp: UpdateUserResponse) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // loading 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // loading 
        this.flag_loading = false;
      }
    });
  }

  // Actualizaremos solo el status del usuario 
  updateRole(user: User): void{
    // loading 
    this.flag_loading = true;
    // Consultamos al servicio de USERS 
    this.sub_user_update = this.usersService.update(user.uuid, this.form1.value).subscribe({
      next: (resp: UpdateUserResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // loading 
        this.flag_loading = false;
      },
      error: (error) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // loading 
        this.flag_loading = false;
      }
    });
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones para el modal de ver usuarios - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  showModalViewUser(user: User): void{
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
   // Mostrar confirmación 
   showConfirmation(user: User){
    this.confirmationService.confirm({
      message: `Estas a punto de eliminar a ${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}, ¿Deseas continuar?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.deleteUser(user);
      },
      reject: (type: any) => {}
    });
  }

  // Eliminar un usuario 
  deleteUser(user: User): void{
    // Bajamos la bandera del modal de eliminación
    this.flag_show_delete_user = false;
    // Consultamos el servicio de USERS 
    this.sub_user_delete = this.usersService.delete(user.uuid).subscribe({
      next: (resp: DeleteUserResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Actualizamos los usuario 
        this.getUsers();
      },
      error: (error) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
      }
    });
  }
}