import { Component, EventEmitter, Input, Output } from '@angular/core';

// PrimeNG 
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { DeleteSubjectResponse } from 'src/app/model/deleteSubjectResponse.interface';
import { Subject } from 'src/app/model/subject.model';
import { SubjectsService } from 'src/app/services/subjects.service';

@Component({
  selector: 'app-delete-subject',
  templateUrl: './delete-subject.component.html',
  styleUrls: ['./delete-subject.component.css']
})
export class DeleteSubjectComponent {

  // Entradas 
  @Input() subject!: Subject;

  // Salidas
  @Output() reload_subjects = new EventEmitter<void>();

  // Banderas 
  loading_flag: boolean = false;

  // Suscripciones 
  sub_delete_subject?: Subscription;

  // Constructor 
  constructor(
    private messageService     : MessageService, 
    private confirmationService: ConfirmationService,
    private subjectsService    : SubjectsService ) 
  {}

  // Iniciar componente 
  start_component(){
    this.show_confirmation();
  }

  // Mostrar confirmación 
  show_confirmation(): void{
    // Creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: `Estas apunto de eliminar la cátedra para ${this.subject.name.toUpperCase()}, ¿Deseas continuar?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Eliminamos
        this.delete_subject(this.subject);
      },
      reject: (type: any) => {}
    });
  }
  
  // Eliminar la cátedra 
  delete_subject(subject: Subject): void{
    // Cargando 
    this.loading_flag = true;
    // Consultamos al servicio de SUBJECTS 
    this.sub_delete_subject = this.subjectsService.delete(subject.uuid).subscribe({
      next: (resp: DeleteSubjectResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg,life: 5000 });
        // Cargando 
        this.loading_flag = false;
        // Obtenemos nuevamente la lista de cátedras 
        this.reload_subjects.emit();
      },
      error: (error) => {
        // Cargando 
        this.loading_flag = false;
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
      }
    });
  }

}
