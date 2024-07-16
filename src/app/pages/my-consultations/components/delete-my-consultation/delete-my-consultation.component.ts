import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { ConsultationsService } from '../../../../services/consultations.service';
import { UpdateConsultationResponse } from 'src/app/model/updateConsultationResponse.interface';
import { Subscription } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-delete-my-consultation',
  templateUrl: './delete-my-consultation.component.html',
  styleUrls: ['./delete-my-consultation.component.css']
})
export class DeleteMyConsultationComponent implements OnDestroy {

  // Salidas 
  @Output() set_reload_consultations = new EventEmitter<void>();
  @Output() set_reload_progress_bar  = new EventEmitter<void>();

  // Banderas 
  loading_flag: boolean = false;

  // Suscripciones 
  sub_delete_consultation?: Subscription; 

  // Constructor 
  constructor(
    private consultationsService: ConsultationsService,
    private confirmationService : ConfirmationService,
    private messageService      : MessageService
  ) {}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_delete_consultation?.unsubscribe();
  }

  // Inicializar componente 
  start_component(consultation: Consultation){
    this.show_confirmation(consultation);
  }

  show_confirmation(consultation: Consultation): void{
    // creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: ` Estás apunto de eliminar tu asesoría sobre ${consultation.subject.name.toUpperCase()}, ¿Deseas continuar?`,
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

  delete_consultation(consultation: Consultation): void{
    // Bandera 
    this.loading_flag = true;
    // Consulta al servicio CONSULTATIONS 
    this.sub_delete_consultation = this.consultationsService.delete(consultation.uuid || '').subscribe({
      next: (resp: UpdateConsultationResponse) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Actualizamos las asesorías dentro de nuestra tabla 
        this.set_reload_consultations.emit();
        // Refrescamos la barra de progreso 
        this.set_reload_progress_bar.emit();
        // this.progressBarConsultationsComponent.refresh()
        // Bandera 
        this.loading_flag = false;
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error',detail: error.error.message, life: 5000 });
        // Bandera 
        this.loading_flag = false;
      }
    });
  }
}