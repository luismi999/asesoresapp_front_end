import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectsService } from '../../../../services/subjects.service';
import { CreateSubjectResponse } from 'src/app/model/createSubjectResponse.interface';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent implements OnInit, OnDestroy{

  // Inputs 
  @Input() create_subject_component_flag !: boolean;

  // Outputs
  @Output() reload_subject_table                   = new EventEmitter<void>();
  @Output() create_subject_component_flag_response = new EventEmitter<boolean>();
  
  // Propiedades 
  loading_flag: boolean = false;
  form       !: FormGroup;

  // Suscripciones 
  sub_create_subject?: Subscription;

  // Constructor
  constructor(
    private fb             : FormBuilder,
    private messageService : MessageService,
    private subjectsService: SubjectsService) 
  {} 

  ngOnInit(): void {
    this.start_form();
  }

  ngOnDestroy(): void {
    this.sub_create_subject?.unsubscribe();
  }
  
  // Inicializar formulario
  start_form(): void{
    this.form = this.fb.group({
      code: ['',[Validators.required]],
      name: ['',[Validators.required]]
    });
  } 

  // Crear cátedra 
  create_subject(): void{
    // Cargando
    this.loading_flag = true;
    // Consultamos el servicio de SUBJECTS 
    this.sub_create_subject = this.subjectsService.create(this.form.value).subscribe({
      next: (resp: CreateSubjectResponse) => {
        // Cargando
        this.loading_flag = false;
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg,life: 5000 });
        // Reiniciamos el formulario 
        this.form.reset();
        // Actualizamos las cátedras de la tabla 
        this.reload_subject_table.emit();
        // Cerramos el componente
        this.close_modal();
      },
      error: (error) => {
        // Cargando
        this.loading_flag = false;
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
      }
    });
  }

  // Cerrar modal 
  close_modal(): void{
    this.create_subject_component_flag_response.emit(false);
  }
}
