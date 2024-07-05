import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { Join } from 'src/app/model/join.model';

// Servicios 
import { ConsultationsService } from '../../services/consultations.service';

// CONSTANTES 
const RANK_BEGINNER_POINTS: number = 99;
const RANK_JUNIOR_POINTS  : number = 100;
const RANK_SENIOR_POINTS  : number = 500;

@Component({
  selector: 'app-rank',
  templateUrl: './rank.component.html',
  styleUrls: ['./rank.component.css']
})
export class RankComponent {

  // Propiedades 
  user_consultations: Consultation[] = [];
  user_joins        : Join[] = [];

  user_points       : number = 0;
  user_average      : number = 0;

  rank: string = '';

  // Suscripciones 
  sub_consultation_find_all_by_user?: Subscription;

  // Constructor 
  constructor( 
    private consultationsService: ConsultationsService){}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_consultation_find_all_by_user?.unsubscribe();
  }

  // Iniciador de componente
  initComponent(user_uuid: string): void{
    this.findAllConsultationsByUser(user_uuid);
  } 

  // Buscar asesorías
  findAllConsultationsByUser(uuid: string): void{
    // Consultamos el servicio de CONSULTATIONS 
    this.sub_consultation_find_all_by_user = this.consultationsService.findAllByUser(uuid).subscribe({
      next: async (resp: Consultation[]) => {
        // Guardamos la respuesta en nuestra variable 
        this.user_consultations = resp;
        // Reiniciamos los joins 
        this.user_joins = [];
        // Mapeamos las asesorías 
        this.user_consultations.map((con: Consultation) => {
          // Mapeamos los joins 
          con.joins?.map((join: Join) => {
            // Guardamos los join en un arreglo 
            if(join.grade != 0)
              this.user_joins.push(join);
          });
        });
        // Obtenemos los puntos 
        this.getPoints();
      },
      error: (error) => {
        // Respuesta 
        console.log(error.error.message);
      }
    });
  } 

  // Obtenemos los puntos del usuario 
  getPoints(): void{
    // Reiniciamos el contador de puntos
    this.user_points = 0;
    // Mapeamos los joins 
    this.user_joins.map((join: any) => {
      // Sumamos los puntos 
      this.user_points += parseInt(join.grade);
    });
    // Obtenemos el promedio 
    this.getAverage();
  }

  // Obtenemos el promedio 
  getAverage(): void{
    // Reiniciamos el promedio 
    this.user_average = 0;
    // Calculamos el promedio 
    this.user_average = this.user_points / this.user_joins.length;
    // Obtenemos el rango 
    this.getRank();
  }

  // Obtenemos el rango 
  getRank(): void{
    // Reiniciamos el rango 
    this.rank = '';
    if(this.user_points <= RANK_BEGINNER_POINTS)
      this.rank = 'BEGINNER';
    if(this.user_points >= RANK_JUNIOR_POINTS)
      this.rank = 'JUNIOR';
    if(this.user_points >= RANK_SENIOR_POINTS &&  this.user_average >= 9)
      this.rank = 'SENIOR'
  }
}