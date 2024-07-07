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
  @Input() flag_show_create_subject!: boolean;

  // Outputs
  @Output() get_subjects_event = new EventEmitter<void>();
  @Output() flag_response = new EventEmitter<boolean>();
  
  // Propiedades 
  form!: FormGroup;

  // Suscripciones 
  sub_subject_create?: Subscription;

  // Constructor
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private subjectsService: SubjectsService) {} 

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.sub_subject_create?.unsubscribe();
  }
  
  // Inicializar formulario
  initForm(): void{
    this.form = this.fb.group({
      code: ['',[Validators.required]],
      name: ['',[Validators.required]]
    });
  } 

  // Crear cátedra 
  createSubject(): void{
    // Consultamos el servicio de SUBJECTS 
    this.sub_subject_create = this.subjectsService.create(this.form.value).subscribe({
      next: (resp: CreateSubjectResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg,life: 5000 });
        // Reiniciamos el formulario 
        this.form.reset();
        // Mandamos el eventos 
        this.get_subjects_event.emit();
        // Cerramos modal
        this.closeModal();
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
      }
    });
  }

  // Cerrar modal 
  closeModal(): void{
    this.flag_response.emit(false);
  }
}
