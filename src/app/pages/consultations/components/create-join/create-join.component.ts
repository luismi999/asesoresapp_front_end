import { Component, EventEmitter, Input, Output } from '@angular/core';

// Modelos 
import { CreateJoinResponse } from 'src/app/model/createJoinResponse.interface';
import { Consultation } from 'src/app/model/consultation.model';
import { CreateJoin } from 'src/app/model/createJoin.interface';
import { User } from 'src/app/model/user.model';

// Servicios 
import { ConfirmationService, MessageService } from 'primeng/api';
import { JoinsService } from '../../../../services/joins.service';

@Component({
  selector: 'app-create-join',
  templateUrl: './create-join.component.html',
  styleUrls: ['./create-join.component.css']
})
export class CreateJoinComponent {

  // Entradas 
  @Input() user?: User;

  // Salidas 
  @Output() set_reload_consultations = new EventEmitter<void>();
  @Output() set_reload_chart         = new EventEmitter<void>();

  // Banderas 
  loading_flag: boolean = false;

  // Constructor 
  constructor(
    private confirmationService: ConfirmationService,
    private joinsService       : JoinsService,
    private messageService     : MessageService
  ) {}

  // Inicializar componente 
  start_component(consultation: Consultation){
    this.show_confirmation(consultation);
  }

  // Confirmación para la creación del join en una asesoría seleccionada
  show_confirmation(consultation: Consultation): void{
    // Creamos el mensaje de la confirmación 
    this.confirmationService.confirm({
      message: `Estás a punto de crear un join en la asesoría sobre ${consultation.subject.name.toUpperCase()} del asesor 
      ${consultation.user.first_name.toUpperCase()} ${consultation.user.last_name.toUpperCase()}. ¿Deseas continuar?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.create_join(consultation);
      },
      reject: (type: any) => {}
    });
  }

  // Creamos el join para la asesoría seleccionada una vez confirmada
  create_join(consultation: Consultation): void{
    // Cargando 
    this.loading_flag = true;
    // Creamos el modelo para crear el join 
    const newJoin: CreateJoin = {uuid_user: this.user?.uuid || '', uuid_consultation: consultation?.uuid};
    // consultamos el servicio de JOINS
    this.joinsService.create(newJoin)
    .subscribe({
      next: (resp: CreateJoinResponse) => {
        // Respuesta del backend
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Reiniciamos la tabla 
        this.set_reload_consultations.emit();
        // Reiniciamos la gráfica 
        this.set_reload_chart.emit();
        // Cargando 
        this.loading_flag = false;
      },
      error: (error) => {
        // Respuesta del backend
        this.messageService.add({key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Cargando 
        this.loading_flag = false;
      }
    })
  }

}
