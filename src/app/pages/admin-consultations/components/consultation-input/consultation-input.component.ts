import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';

// Servicios 
import { ConsultationsService } from '../../../../services/consultations.service';

@Component({
  selector: 'app-consultation-input',
  templateUrl: './consultation-input.component.html',
  styleUrls: ['./consultation-input.component.css']
})
export class ConsultationInputComponent implements OnDestroy {

  // Salidas 
  @Output() set_consultations = new EventEmitter<Consultation[]>();

  // Propiedades
  consultations: Consultation[] = [];

  // Banderas 
  loading_flag: boolean = false;

  // Suscripciones 
  sub_find_all_consultations?: Subscription;

  // Constructor 
  constructor(private consultationsService: ConsultationsService) {}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_find_all_consultations?.unsubscribe();
  }

   // Buscamos las asesorías por código de usuario 
   find_consultations_by_user_code(event: any): void{
    // Cargando 
    this.loading_flag = true;
    // Obtenemos el valor del selector 
    const code: string = event.target.value;
    // Reiniciamos la variable de consultations 
    this.consultations = [];
    this.sub_find_all_consultations = this.consultationsService.findAll().subscribe({
      next: (resp: Consultation[]) => {
        // Mapeamos la respuesta 
        resp.map((con: Consultation) => {
          if(con.user.institutional_code == code)
            this.consultations.push(con);
        });
        // Recargamos las asesorías 
        this.set_consultations.emit(this.consultations);
        // Cargando 
        this.loading_flag = false;
      },
      error: (error) => {
        // Respuesta del back 
        console.log(error.error.message);
        // Cargando 
        this.loading_flag = false;
      }
    });
  }
}