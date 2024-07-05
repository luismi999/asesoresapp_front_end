import { Component, EventEmitter, Input, Output } from '@angular/core';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { Join } from 'src/app/model/join.model';

// Servicios 
import { JoinsService } from 'src/app/services/joins.service';

@Component({
  selector: 'app-view-comments',
  templateUrl: './view-comments.component.html',
  styleUrls: ['./view-comments.component.css']
})
export class ViewCommentsComponent {

  // Entradas 
  @Input() flag!: boolean;
  // Salidas 
  @Output() flag_response = new EventEmitter<boolean>();

  // Propiedades 
  joins ?: Join[] = [];

  // Banderas 
  flag_loading: boolean = false;

  // Constructor 
  constructor(private joinsService : JoinsService ){}

  // Iniciar componente 
  initComponent(consultation: Consultation){
    this.findJoinsByConsultation(consultation);
  }

  // Buscamos los asesoramientos por asesoría 
  findJoinsByConsultation(consultation: Consultation){
    // Bandera
    this.flag_loading = true;
    // Reiniciamos los joins 
    this.joins = [];
    // Consultamos el servicio de JOINS 
    this.joinsService.findAllByConsultation(consultation?.uuid || "")
    .subscribe({
      next: (resp: Join[]) => {
        // Guardamos los joins 
        this.joins = resp;
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
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