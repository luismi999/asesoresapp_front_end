import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

// Modelos 
import { User } from 'src/app/model/user.model';
import { UsersService } from '../../../../services/users.service';
import { DeleteUserResponse } from 'src/app/model/deleteUserResponse.interface';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnDestroy {

  // Salidas 
  @Output() reload_users = new EventEmitter<void>();

  // Suscripciones
  sub_user_delete?: Subscription; 

  // Banderas 
  loading_flag: boolean = false;

  // Constructor 
  constructor(
    private confirmationService: ConfirmationService,
    private messageService     : MessageService,
    private usersService       : UsersService
  ){}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_user_delete?.unsubscribe();
  }

  // Inicializado 
  start_component(user: User): void {
    this.show_confirmation(user);
  }

  // Mostrar confirmación 
  show_confirmation(user: User){
    this.confirmationService.confirm({
      message: `Estas a punto de eliminar a ${user.first_name.toUpperCase()} ${user.last_name.toUpperCase()}, ¿Deseas continuar?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.delete_user(user);
      },
      reject: (type: any) => {}
    });
  }

  // Eliminar un usuario 
  delete_user(user: User): void{
    // Cargando 
    this.loading_flag = true;
    // Consultamos el servicio de USERS 
    this.sub_user_delete = this.usersService.delete(user.uuid).subscribe({
      next: (resp: DeleteUserResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Actualizamos los usuario de la tabla
        this.reload_users.emit();
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
}