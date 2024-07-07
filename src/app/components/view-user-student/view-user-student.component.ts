import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user.model';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-view-user-student',
  templateUrl: './view-user-student.component.html',
  styleUrls: ['./view-user-student.component.css']
})
export class ViewUserStudentComponent {

  // Inputs y outputs del componente 
  @Input() flag!: boolean;
  @Input() user_who_wants_to_see!: User | undefined;
  @Output() flag_response = new EventEmitter<boolean>();

  // Propiedades 
  user ?: User;

  // Banderas 
  flag_loading: boolean = false;

  // Suscripciones 
  sub_user_find_one?: Subscription;

  // Constructor 
  constructor( private usersService: UsersService ){}

  // Inicializado 
  ngOnInit(): void {}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_user_find_one?.unsubscribe();
  }

  // Inicializamos el componente 
  initComponent(uuid_user: string): void{
    this.findUser(uuid_user);
  }

  // Buscamos el usuario 
  findUser(uuid_user: string): void{
    // Bandera 
    this.flag_loading = true;
    // Consultamos el servicio de USERS 
      this.sub_user_find_one = this.usersService.findOne(uuid_user).subscribe({
      next: (resp: User) => {
        // Guardamos la respuesta en una variable 
        this.user = resp;
        // Bandera 
        this.flag_loading = false;
      },error: (error) => {
        // Respuesta 
        console.log(error.error.message);
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Cerrar modal 
  closeModal(): void{
    this.flag_response.emit(false);
  }
}