import { Component, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { UsersService } from '../../../../services/users.service';

@Component({
  selector: 'app-user-selector',
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.css']
})
export class UserSelectorComponent {

  // Salidas 
  @Output() set_users        = new EventEmitter<User[]>();
  @Output() set_loading_flag = new EventEmitter<boolean>();

  // Constructor 
  constructor(private usersService: UsersService){}

  // Propiedades 
  users: User[] = [];

  // Suscripciones 
  sub_user_find_all?: Subscription;

  // Obtenemos los usuarios
  get_users_by_selector(event: any): void{
    // Cargando
    this.set_loading_flag.emit(true);
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
        // Actualizar usuarios 
        this.set_users.emit(this.users);
        // Cargando
        this.set_loading_flag.emit(false);
      },
      error: (error) => {
        // Respuesta del backend 
        console.log(error.error.message);
        // Cargando
        this.set_loading_flag.emit(false);
      }
    })
  }
}