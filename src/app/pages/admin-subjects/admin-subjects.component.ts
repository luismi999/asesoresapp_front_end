import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

// Servicios 
import { SubjectsService } from '../../services/subjects.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// Modelos 
import { Subject } from 'src/app/model/subject.model';
import { CreateSubjectResponse } from 'src/app/model/createSubjectResponse.interface';

// Interfaces 
import { DeleteSubjectResponse } from 'src/app/model/deleteSubjectResponse.interface';

// Componentes 
import { ChatComponent } from 'src/app/components/chat/chat.component';

// Instrucciones 
import { instruction_subjects } from 'src/app/instruction_chats/instructions';

@Component({
  selector: 'app-admin-subjects',
  templateUrl: './admin-subjects.component.html',
  styleUrls: ['./admin-subjects.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class AdminSubjectsComponent {

  @ViewChild(ChatComponent) chatComponent!: ChatComponent;

  // Propiedades 
  subjects: any[] = [];
  form    !: FormGroup;

  // Banderas 
  flag_show_create_subject: boolean = false;
  flag_loading            : boolean = false;

  // Suscripciones 
  sub_subject_find_all?: Subscription;
  sub_subject_create  ?: Subscription;
  sub_subject_delete  ?: Subscription;

  // Propiedades para el chat 
  instructions  : any[] = instruction_subjects;
  flag_show_chat: boolean = false;

  // Constructor 
  constructor( 
    private messageService     : MessageService,
    private fb                 : FormBuilder,
    private confirmationService: ConfirmationService,
    private subjectsService    : SubjectsService){}

  // Inicializado 
  ngOnInit(): void {
    this.getSubjects();
    this.initForm();
  }

  // Destructor
  ngOnDestroy(): void {
    this.sub_subject_find_all?.unsubscribe();
    this.sub_subject_create?.unsubscribe();
    this.sub_subject_delete?.unsubscribe();
  } 

  // Inicializar formulario
  initForm(): void{
    this.form = this.fb.group({
      code: ['',[Validators.required]],
      name: ['',[Validators.required]]
    });
  } 

  // Obtener todos las cátedras 
  getSubjects(): void{
    // Bandera 
    this.flag_loading = true; // Bandera 
    // Reiniciamos las cátedras 
    this.subjects = []; 
    // Consultamos el servicio de SUBJECTS 
    this.sub_subject_find_all = this.subjectsService.findAll().subscribe({
      next: (resp: Subject[]) => {
        // Guardamos la respuesta en la variable de cátedras 
        this.subjects = resp;
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Retornamos 
        console.log(error.error.message);
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Mostrar el modal para crear una cátedra 
  showModalCreate(): void{
    this.flag_show_create_subject = true;
  }

  // Crear cátedra 
  createSubject(): void{
    this.flag_show_create_subject = false;
    // Bandera 
    this.flag_loading = true;
    // Consultamos el servicio de SUBJECTS 
    this.sub_subject_create = this.subjectsService.create(this.form.value).subscribe({
      next: (resp: CreateSubjectResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg,life: 5000 });
        // Bandera 
        this.flag_loading = false;
        // Reiniciamos el formulario 
        this.form.reset();
        // Obtenemos nuevamente la lista de cátedras 
        this.getSubjects();
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Mostrar confirmación 
  showConfirmation(subject: Subject): void{
    // Creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: `¿Deseas eliminar la cátedra de ${subject.name.toUpperCase()}? Esto tendrá gran impacto sobre las asesorías y asesoramientos`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.deleteSubject(subject);
      },
      reject: (type: any) => {}
    });
  }

  // Eliminar una cátedra 
  deleteSubject(subject: Subject): void{
    // Bandera 
    this.flag_loading = true;
    // Consultamos al servicio de SUBJECTS 
    this.sub_subject_delete = this.subjectsService.delete(subject.uuid).subscribe({
      next: (resp: DeleteSubjectResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg,life: 5000 });
        // Bandera 
        this.flag_loading = false;
        // Obtenemos nuevamente la lista de cátedras 
        this.getSubjects();
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Mostramos el modal del chat 
  showChat(){
    // Bandera 
    this.flag_show_chat = true;
    // Iniciamos el componente 
    setTimeout(() => {
      this.chatComponent.initComponent();
    }, 100);
  }
}