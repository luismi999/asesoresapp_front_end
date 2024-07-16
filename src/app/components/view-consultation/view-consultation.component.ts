import { Component, EventEmitter, Input, Output } from '@angular/core';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { Join } from 'src/app/model/join.model';

// Servicios 
import { ConsultationsService } from '../../services/consultations.service';
import { Subscription } from 'rxjs';
import { JoinsService } from '../../services/joins.service';

@Component({
  selector: 'app-view-consultation',
  templateUrl: './view-consultation.component.html',
  styleUrls: ['./view-consultation.component.css']
})
export class ViewConsultationComponent {

  // Inputs y outputs del componente
  @Input() flag!: boolean;
  @Output() flag_response = new EventEmitter<boolean>();

  // Propiedades 
  consultation?: Consultation;
  joins       ?: Join[] = [];

  // Banderas 
  flag_loading: boolean = false;

  // Suscripciones 
  sub_consultation_find_one?: Subscription;

  // Inicializado 
  ngOnInit(): void {}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_consultation_find_one?.unsubscribe();
  }

  // Constructor 
  constructor( 
    private consultationsService: ConsultationsService,
    private joinsService        : JoinsService ){}

  // Inicializar el componente 
  initComponent(uuid_consultation: string): void{
    // Buscamos el usuario y una vez encontrado el usuario inicializamos el mapa 
    this.findConsultation(uuid_consultation);
  }

  // Buscar la asesoría 
  findConsultation(uuid_consultation: string): void{
    // Bandera 
    this.flag_loading = true;
    // Consultamos al servicio de CONSULTATIONS 
    this.sub_consultation_find_one = this.consultationsService.findOne(uuid_consultation).subscribe({
      next: (resp: any) => {
        // Guardamos la respuesta en nuestra variable 
        this.consultation = resp;
        // Bandera 
        this.flag_loading = false;
        // Buscamos los joins de la asesoría 
        this.findJoinsByConsultation(resp);
      },error: (error) => {
        // Respuesta 
        console.log(error.error.message);
        // Bandera 
        this.flag_loading = false;
      }
    });
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