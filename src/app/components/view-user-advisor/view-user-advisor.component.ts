import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';

// Componentes hijos 
import { ChartAdvisorComponent } from '../chart-advisor/chart-advisor.component';
import { RankComponent } from '../rank/rank.component';

// Modelos 
import { User } from 'src/app/model/user.model';
import { Join } from 'src/app/model/join.model';

// Servicios 
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-user-advisor',
  templateUrl: './view-user-advisor.component.html',
  styleUrls: ['./view-user-advisor.component.css']
})
export class ViewUserAdvisorComponent {

  @ViewChild(ChartAdvisorComponent) chartAdvisorComponent!: ChartAdvisorComponent;
  @ViewChild(RankComponent) rankComponent!: RankComponent;

  // Inputs y outputs del componente 
  @Input() flag!: boolean;
  @Input() user_who_wants_to_see!: User | undefined;
  @Output() flag_response = new EventEmitter<boolean>();

  // Propiedades 
  user ?: User;
  joins: Join[] = [];

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
        // Inicializamos el componente para la gráfica 
        this.chartAdvisorComponent.initComponent(this.user?.uuid || '');
        // Inicializamos el componente para el rango 
        this.rankComponent.initComponent(resp.uuid);
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
