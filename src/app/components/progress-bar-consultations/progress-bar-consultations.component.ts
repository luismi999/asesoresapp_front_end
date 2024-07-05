import { Component, Input } from '@angular/core';

// Servicios 
import { UsersService } from '../../services/users.service';
import { ConsultationsService } from '../../services/consultations.service';

// Modelos 
import { User } from 'src/app/model/user.model';
import { Consultation } from 'src/app/model/consultation.model'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-progress-bar-consultations',
  templateUrl: './progress-bar-consultations.component.html',
  styleUrls: ['./progress-bar-consultations.component.css']
})
export class ProgressBarConsultationsComponent {

  // Inputs y outputs del componente 
  @Input() uuid_user         !: string;
  
  // Propiedades 
  max_active_consultations   : number = 5;
  all_my_active_consultations: Consultation[] = []

  // Suscripciones 
  sub_user_find_one                ?: Subscription;
  sub_consultation_find_all_by_user?: Subscription;

  // Constructor 
  constructor( 
    private usersService        : UsersService,
    private ConsultationsService: ConsultationsService){}

  // Inicializado 
  ngOnInit(): void {
    this.findUser();
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_user_find_one                ?.unsubscribe();
    this.sub_consultation_find_all_by_user?.unsubscribe();
  }

  // Refrescar el componente 
  refresh(): void{
    this.findUser();
  }

  // Buscar usuario 
  findUser(): void{
    // Consultamos el servicio de USERS 
    this.sub_user_find_one = this.usersService.findOne(this.uuid_user).subscribe({
      next: (resp: User) => {
        // Mandamos el usuario a la función de asesorías 
        this.findConsultations(resp);
      },
      error: (error) => {
        // Respuesta 
        console.log(error.error.message);
      }
    });
  }

  // Buscar asesorías 
  findConsultations(user: User): void{
    // Consultamos el servicio de CONSULTATIONS 
    this.sub_consultation_find_all_by_user = this.ConsultationsService.findAllByUser(user.uuid).subscribe({
      next: (resp: Consultation[]) => {
        this.all_my_active_consultations = [];
        // Mapeamos la respuesta 
        resp.map((con: Consultation) => {
          if(con.isActive){
            this.all_my_active_consultations.push(con);
          }
        });
      },
      error: (error) => {
        // Respuesta 
        console.log(error.error.message);
      }
    });
  }
}