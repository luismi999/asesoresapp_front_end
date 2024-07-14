import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { UsersService } from '../../../../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.css']
})
export class UserInputComponent implements OnDestroy {

  // Salidas 
  @Output() set_loading_flag = new EventEmitter<boolean>();
  @Output() set_users = new EventEmitter<User[]>();

  // Banderas 
  loading_flag: boolean = false;

  // Propiedades 
  users: User[] = [];

  // Suscripciones 
  sub_find_all_users?: Subscription;

  // Destructor 
  ngOnDestroy(): void {
    this.sub_find_all_users?.unsubscribe();
  }

  // Constructor 
  constructor(private usersService: UsersService){}

  // Obtener usuario por código institucional 
  get_user_by_institutional_code(event: any){
    // Cargando 
    this.set_loading_flag.emit(true);
    // Guardamos el valor del evento 
    const institutionalCode: string = event.target.value;
    // Reiniciamos usuarios 
    this.users = [];
    // Consultamos al servicio de USERS 
    this.sub_find_all_users = this.usersService.findAll()
    .subscribe({
      next: (resp: User[]) => {
        // Mapeamos la respuesta 
        resp.map((user: User) => {
          if(user.institutional_code == institutionalCode)
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
        // loading 
        this.set_loading_flag.emit(false);
      }
    });
  }
}