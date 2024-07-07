import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

/* Modelos */
import { User } from '../model/user.model';

/* Servicios */
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

// Componentes hijos 
import { RankComponent } from '../components/rank/rank.component';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.css']
})
export class PagesComponent {

  @ViewChild(RankComponent) rankComponent!: RankComponent;

  /* Propiedades */
  my_user?: User;

  // Banderas 
  flag_loading: boolean = false;

  // Suscripciones 
  sub_user_find_one?: Subscription;

  /* Constructor */
  constructor(
    private authService : AuthService,
    private usersService: UsersService){}
  
  // Iniciador 
  ngOnInit() {
    this.my_user = this.authService.getUser();
    this.findUser(this.my_user?.uuid || '');
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_user_find_one?.unsubscribe();
  }

  // Buscamos el usuario 
  findUser(uuid_user: string){
    // Bandera 
    this.flag_loading = true;
    // Consultamos el servicio de USERS 
      this.sub_user_find_one = this.usersService.findOne(uuid_user).subscribe({
      next: async (resp: any) => {
        // Guardamos la respuesta en una variable 
        this.my_user = await resp;
        // Inicializamos el componente para el rango 
        this.rankComponent?.initComponent(resp.uuid);
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
}
