import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

// Servicios 
import { JoinsService } from '../../../../services/joins.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// Modelos 
import { Join } from 'src/app/model/join.model';
import { Consultation } from 'src/app/model/consultation.model';
import { UpdateJoinResponse } from 'src/app/model/updateJoinResponse.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-finish-join',
  templateUrl: './finish-join.component.html',
  styleUrls: ['./finish-join.component.css']
})
export class FinishJoinComponent implements OnDestroy {

  // Salidas 
  @Output() set_reload_joins = new EventEmitter<void>();

  // Banderas 
  loading_flag: boolean = false;

  // Propiedades 
  join!: Join;

  // Suscripciones 
  sub_update_join?: Subscription;

  // Constructor 
  constructor(
    private joinsService        : JoinsService,
    private confirmationService : ConfirmationService,
    private messageService      : MessageService
  ) {}

  // Destructor 
  ngOnDestroy(): void {
    this.sub_update_join?.unsubscribe();
  }

  // Inicializar componente 
  start_component(join: Join, consultation: Consultation){
    this.show_confirmation(join, consultation);
  }

  // Mostrar modal de confirmación 
  show_confirmation(join: Join, consultation: Consultation){
    // creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: ` Estás apunto de finalizar el join de la asesoría sobre ${consultation.subject.name.toUpperCase()} y darás paso a  
      ${join.user.first_name.toUpperCase()} ${join.user.last_name.toUpperCase()} dar retroalimentación (En progreso -> Retroalimentación). ¿Deseas continuar?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.update_join(join);
      },
      reject: (type: any) => {}
    });
  }

  // Actualizamos el join 
  update_join(join: Join): void{
    // Cargando 
    this.loading_flag = true;
    // consultamos el servicio JOINS
    this.sub_update_join = this.joinsService.updateJoin(join.uuid || '')
    .subscribe({
      next: (resp: UpdateJoinResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg,life: 5000 });
        // Recargar joins 
        this.set_reload_joins.emit();
        // Cargando 
        this.loading_flag = false;
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Cargando 
        this.loading_flag = false;
      }
    });
  }
}