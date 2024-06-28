import { Component, EventEmitter, Input, Output } from '@angular/core';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { Join } from 'src/app/model/join.model';

// Servicios 
import { JoinsService } from '../../../../services/joins.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { UpdateJoinResponse } from 'src/app/model/updateJoinResponse.interface';

@Component({
  selector: 'app-view-joins',
  templateUrl: './view-joins.component.html',
  styleUrls: ['./view-joins.component.css'],
  providers: [ ConfirmationService, MessageService ]
})
export class ViewJoinsComponent {

  // Inputs y outputs del componente
  @Input() flag!: boolean;
  @Output() flag_response = new EventEmitter<boolean>();
  @Output() flag_confirmation = new EventEmitter<boolean>();

  // Propiedades 
  consultation?: Consultation;
  joins       ?: Join[];

  // Banderas 
  flag_loading : boolean = false;

  // Constructor 
  constructor( 
    private joinsService       : JoinsService,
    private messageService     : MessageService,
    private confirmationService: ConfirmationService ){}

  // Inicializado 
  ngOnInit(): void {}

  // Iniciamos el componente 
  initComponent(consultation: Consultation): void{
    this.findAllJoinsByConsultation(consultation);
  }

  // Buscamos todos los joins correspondientes a mi asesoría
  findAllJoinsByConsultation(consultation: Consultation): void{
    // Bandera 
    this.flag_loading = true;
    // Guardamos la asesoría 
    this.consultation = consultation;
    // Consulta al servicio JOINS 
    this.joinsService.findAllByConsultation(consultation?.uuid || '')
    .subscribe({
      next: (resp: Join[]) => {
        // Guardamos la respuesta en nuestra variable de joins
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

  // Mostrar confirmación 
  showConfirmation(join: Join): void{
    // Bandera y emitimos
    this.flag = false;
    this.flag_response.emit(false);
    // Creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: `¿Deseas pasar a InLimbo el asesoramiento de ${join.user.first_name.toUpperCase()} ${join.user.last_name.toUpperCase()}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos el join 
        this.updateJoin(join);
      },
      reject: (type: any) => {}
    });
  }

  // Actualizamos el join 
  updateJoin(join: Join): void{
    // Bandera 
    this.flag_loading = true;
    // consultamos el servicio JOINS
    this.joinsService.updateJoin(join.uuid || '')
    .subscribe({
      next: (resp: UpdateJoinResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg,life: 5000 });
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
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