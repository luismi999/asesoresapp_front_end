import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

// Modelos 
import { deleteConsultationResponse } from 'src/app/model/deleteConsultationResponse.interface';
import { Consultation } from 'src/app/model/consultation.model';

// Servicios 
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultationsService } from '../../../../services/consultations.service';

@Component({
  selector: 'app-delete-consultation',
  templateUrl: './delete-consultation.component.html',
  styleUrls: ['./delete-consultation.component.css']
})
export class DeleteConsultationComponent implements OnDestroy {

  // Salidas 
  @Output() set_reload_consultations = new EventEmitter<void>();

  // Banderas 
  loading_flag: boolean = false;

  // Suscripciones 
  sub_delete_consultation?: Subscription;

  // Constructor 
  constructor(
    private messageService      : MessageService,
    private confirmationService : ConfirmationService,
    private consultationsService: ConsultationsService
  ) {}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_delete_consultation?.unsubscribe();
  }

  // Iniciar componente 
  start_component(consultation: Consultation){
    this.show_confirmation((consultation));
  }

  // Mostrar modal de confirmación de eliminación 
  show_confirmation(consultation: Consultation): void{
    // Creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: `Estás a punto de eliminar la asesoría sobre ${consultation.subject.name.toUpperCase()} del asesor ${consultation.user.first_name.toUpperCase()} 
      ${consultation.user.last_name.toUpperCase()}, ¿Deseas continuar?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.delete_consultation(consultation);
      },
      reject: (type: any) => {}
    });
  }

  // Eliminar asesoría 
  delete_consultation(consultation: Consultation): void{
    // Cargando
    this.loading_flag = true; 
    // Consultamos el servicio de CONSULTATIONS 
    this.sub_delete_consultation = this.consultationsService.delete(consultation.uuid).subscribe({
      next: (resp: deleteConsultationResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Reiniciamos las asesorías 
        this.set_reload_consultations.emit();
        // Cargando
        this.loading_flag = false;
      },
      error: (error) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Cargando
        this.loading_flag = false;
      }
    });
  }
}