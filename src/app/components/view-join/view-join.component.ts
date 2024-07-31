import { Component, Input, OnDestroy } from '@angular/core';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { Join } from 'src/app/model/join.model';
import { ConsultationsService } from '../../services/consultations.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-join',
  templateUrl: './view-join.component.html',
  styleUrls: ['./view-join.component.css']
})
export class ViewJoinComponent implements OnDestroy {

  // Entradas 
  @Input() get_join!: Join;

  // Propiedades 
  join        !: Join;
  consultation?: Consultation;

  // Banderas 
  show_flag   : boolean = false;
  loading_flag: boolean = false;

  // Suscripciones 
  sub_find_one_consultation?: Subscription;

  // Constructor 
  constructor(private consultationsService: ConsultationsService) {}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_find_one_consultation?.unsubscribe();
  }

  // Inicializar componente 
  start_component(join: Join, uuid_consultation: string){
    this.join = join;
    this.find_consultation(uuid_consultation);
    this.show_modal();
  }

  // Buscar asesoría 
  find_consultation(uuid_consultation: string) {
    // Cargando 
    this.loading_flag = true;
    // Consultamos el servicio de asearías
    this.sub_find_one_consultation = this.consultationsService.findOne(uuid_consultation).subscribe({
      next: (consultation: Consultation) => {
        // Cargando
        this.loading_flag = false;
        // Guardamos la asesoría 
        this.consultation = consultation;
      },
      error: (error) => {
        // Cargando
        this.loading_flag = false;
        // MOstramos el error 
        console.log(error.error.message);
      }
    });
  }

  // Mostrar modal 
  show_modal(){
    this.show_flag = true;
  }

  // Cerrar modal 
  close_modal(){
    this.show_flag = false;
  }
}
