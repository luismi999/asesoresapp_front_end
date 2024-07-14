import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Servicios 
import { SubjectsService } from '../../services/subjects.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// Modelos 
import { Subject } from 'src/app/model/subject.model';

// Instrucciones 
import { CreateSubjectComponent } from './components/create-subject/create-subject.component';
import { DeleteSubjectComponent } from './components/delete-subject/delete-subject.component';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class AdminSubjectsComponent {

  // @ViewChild(ChatComponent) chatComponent!: ChatComponent;
  @ViewChild(CreateSubjectComponent) createSubjectComponent!: CreateSubjectComponent;
  @ViewChild(DeleteSubjectComponent) deleteSubjectComponent!: DeleteSubjectComponent;

  // Propiedades 
  subjects: any[] = [];
  form    !: FormGroup;

  // Banderas 
  create_subject_component_flag: boolean = false;
  loading_flag                 : boolean = false;

  // Suscripciones 
  sub_subject_find_all?: Subscription;

  // Constructor 
  constructor( 
    private fb             : FormBuilder,
    private subjectsService: SubjectsService
  ){}

  // Inicializado 
  ngOnInit(): void {
    this.get_subjects();
    this.start_form();
  }

  // Destructor
  ngOnDestroy(): void {
    this.sub_subject_find_all?.unsubscribe();
  } 

  // Inicializar formulario
  start_form(): void{
    this.form = this.fb.group({
      code: ['',[Validators.required]],
      name: ['',[Validators.required]]
    });
  } 

  // Obtener todos las cátedras 
  get_subjects(): void{
    // Bandera 
    this.loading_flag = true; // Bandera 
    // Reiniciamos las cátedras 
    this.subjects = []; 
    // Consultamos el servicio de SUBJECTS 
    this.sub_subject_find_all = this.subjectsService.findAll().subscribe({
      next: (resp: Subject[]) => {
        // Guardamos la respuesta en la variable de cátedras 
        this.subjects = resp;
        // Bandera 
        this.loading_flag = false;
      },
      error: (error) => {
        // Retornamos 
        console.log(error.error.message);
        // Bandera 
        this.loading_flag = false;
      }
    });
  }

  // ---------------------------------------- Componente hijo (Create subject component) ---------------------------------------

  // Mostramos el componente de crear cátedra
  show_create_subject_component(): void {
    this.create_subject_component_flag = true;
  }

  // --------------------------------------- Componente hijo (Delete subject component) ---------------------------------------
  show_delete_subject_component(subject: Subject): void {
    this.deleteSubjectComponent.subject = subject;
    this.deleteSubjectComponent.start_component();
  }
}