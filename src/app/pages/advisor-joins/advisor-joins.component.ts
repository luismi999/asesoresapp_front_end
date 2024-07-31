import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { ConsultationsService } from '../../services/consultations.service';
import { Join } from 'src/app/model/join.model';
import { ViewJoinComponent } from 'src/app/components/view-join/view-join.component';
import { FinishJoinComponent } from './components/finish-join/finish-join.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-advisor-joins',
  templateUrl: './advisor-joins.component.html',
  styleUrls: ['./advisor-joins.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class AdvisorJoinsComponent implements OnInit {

  // Componentes hijos 
  @ViewChild(ViewJoinComponent) viewJoinComponent?: ViewJoinComponent;
  @ViewChild(FinishJoinComponent) finishJoinComponent?: FinishJoinComponent;

  // Propiedades 
  consultation!: Consultation;
  joins       !: Join[];
  uuid        !: any;

  // Banderas 
  loading_flag: boolean = false;

  // Suscripciones
  sub_find_one_consultation?: Subscription; 

  // Constructor 
  constructor(
    private consultationsService: ConsultationsService,
    private route: ActivatedRoute
  ){}

  // Inicializado 
  ngOnInit(): void {
    this.start_component();
  }

  // Iniciar componente 
  start_component(): void{
    this.get_uuid();
    this.find_consultation();
  }

  get_uuid(): void{
    this.route.paramMap.subscribe(param => {
      this.uuid = param.get('uuid');
    });
  }

  // Buscar asesoría
  find_consultation(): void{
    // Cargando 
    this.loading_flag = true;
    // Consultamos el servicio 
    this.sub_find_one_consultation = this.consultationsService.findOne(this.uuid).subscribe({
      next: (consultation: Consultation) => {
        // Guardamos la asesoría 
        this.consultation = consultation;
        // Obtenemos los joins 
        this.get_joins(consultation);
        // Cargando 
        this.loading_flag = false;
      },
      error: (error) => {
        // Mostramos el error 
        console.log(error.error.message);
        // Cargando 
        this.loading_flag = false;
      }
    });
  } 

  // Obtener los joins 
  get_joins(consultation: Consultation): void {
    // Cargando 
    this.loading_flag = true;
    // Guardamos los joins de la asesoría 
    this.joins = consultation.joins;
    // Cargando 
    this.loading_flag = false;
  }

  // --------------------------------------------------------------------- Componente hijo (view join) -------------------------------------------------------
  // Inicializamos el componente 
  show_modal_view_join(join: Join, uuid_consultation: string){
    this.viewJoinComponent?.start_component(join, uuid_consultation);
  } 

  // -------------------------------------------------------------------- Componente hijo (finish join) -----------------------------------------------------
  show_finish_join_component(join: Join, consultation: Consultation){
    this.finishJoinComponent?.start_component(join, consultation);
  } 
}