import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { User } from 'src/app/model/user.model';

// Servicios 
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/services/auth.service';
import { ConsultationsService } from 'src/app/services/consultations.service';
import { SubjectsService } from 'src/app/services/subjects.service';

// Componentes hijos 
import { ViewConsultationComponent } from '../../components/view-consultation/view-consultation.component';
import { Subject } from 'src/app/model/subject.model';
import { UpdateConsultationResponse } from 'src/app/model/updateConsultationResponse.interface';
import { deleteConsultationResponse } from 'src/app/model/deleteConsultationResponse.interface';

@Component({
  selector: 'app-admin-consultations',
  templateUrl: './admin-consultations.component.html',
  styleUrls: ['./admin-consultations.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class AdminConsultationsComponent {

  @ViewChild(ViewConsultationComponent) viewConsultationComponent!: ViewConsultationComponent;

  // Propiedades 
  my_user           ?: User;
  subjects          ?: any[];
  saved_consultation?: Consultation;
  form1             !: FormGroup;

  // Propiedades de la tabla de asesorías 
  all_consultations           : Consultation[] = [];
  all_consultations_by_subject: Consultation[] = [];

  // Banderas de los modales
  flag_show_view_consultation: boolean = false;
  flag_loading               : boolean = false;

  // Suscripciones
  sub_consultation_find_all?: Subscription;
  sub_subject_find_all     ?: Subscription;

  // Constructor
  constructor(
    private authService         : AuthService,
    private consultationsService: ConsultationsService,
    private fb                  : FormBuilder,
    private confirmationService : ConfirmationService,
    private subjectsService     : SubjectsService,
    private messageService      : MessageService){}
    
  // Inicializado
  ngOnInit(): void {
    this.my_user = this.authService.getUser();
    this.getSubjects();
    this.initForms();
    this.findAllConsultations();
  }

  // Destructor
  ngOnDestroy(): void {
    this.sub_consultation_find_all?.unsubscribe();
    this.sub_subject_find_all?.unsubscribe();
  }

  // Inicializar formulario 
  initForms(): void{
    // Formulario para cambiar el role de un asesor 
    this.form1 = this.fb.group({
      status: ['']
    });
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones de la tabla de asesoramientos - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Obtener cátedras 
  getSubjects(): void{
    // Reiniciamos nuestra variable 
    this.subjects = [];
    // Consultamos al servicio de SUBJECTS 
    this.sub_subject_find_all = this.subjectsService.findAll().subscribe({
      next: (resp: Subject[]) => {
        // Guardamos la respuesta en la variable de cátedras 
        this.subjects = resp;
      },
      error: (error) => {
        // Retornamos 
        console.log(error.error.message);
      }
    });
  }

  // buscamos todas las asesorías
  findAllConsultations(): void{
    // Bandera 
    this.flag_loading = true;
    // Reiniciamos la variable 
    this.all_consultations_by_subject = [];
    // consultamos al servicio de CONSULTATIONS
    this.sub_consultation_find_all = this.consultationsService.findAll().subscribe({
      next: (resp: Consultation[]) => {
        // Guardamos las asesorías recibidas en nuestras variables 
        this.all_consultations = resp;
        this.all_consultations_by_subject = resp;
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

  // Buscamos las asesorías por cátedra
  filterConsultationsBySubject(event: any): void{
    // Bandera 
    this.flag_loading = true;
    // Obtenemos el valor del selector 
    const subject = event.target.value.toLowerCase();
    // Reiniciamos la variable de consultations 
    this.all_consultations = [];
    if(subject != 'novalue'){
      this.sub_consultation_find_all = this.consultationsService.findAll().subscribe({
        next: (resp: Consultation[]) => {
          // Mapeamos la respuesta del backend 
          resp.map((con: Consultation) => {
            // Si la asesoría coincide con la materia 
            if(con.subject.name == subject)
              this.all_consultations.push(con); 
          });
          // Bandera 
          this.flag_loading = false;
        },
        error: (error) => {
          // Respuesta del back 
          console.log(error.error.message);
          // Bandera 
          this.flag_loading = false;
        }
      });
    }
    else if(subject == 'novalue'){
      this.sub_consultation_find_all = this.consultationsService.findAll().subscribe({
        next: (resp: Consultation[]) => {
          // Mapeamos la respuesta 
          resp.map((con: Consultation) => {
            this.all_consultations.push(con);
          });
          // Bandera 
          this.flag_loading = false;
        },
        error: (error) => {
          // Respuesta del back 
          console.log(error.error.message);
          // Bandera 
          this.flag_loading = false;
        }
      });
    }
  }

  // Buscamos las asesorías por código de usuario 
  findConsultationsByUserCode(event: any): void{
    // Bandera 
    this.flag_loading = true;
    // Obtenemos el valor del selector 
    const code: string = event.target.value;
    // Reiniciamos la variable de consultations 
    this.all_consultations = [];
    this.sub_consultation_find_all = this.consultationsService.findAll().subscribe({
      next: (resp: Consultation[]) => {
        // Mapeamos la respuesta 
        resp.map((con: Consultation) => {
          if(con.user.institutional_code == code)
            this.all_consultations.push(con);
        });
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta del back 
        console.log(error.error.message);
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Actualizar asesoría 
  updateStatus(consultation: Consultation): void{
    // loading 
    this.flag_loading = true;
    // Consultamos al servicio de USERS 
    this.consultationsService.updateByAdmin(consultation.uuid || '', this.form1.value).subscribe({
      next: (resp: UpdateConsultationResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // loading 
        this.flag_loading = false;
      },
      error: (error) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // loading 
        this.flag_loading = false;
      }
    });
  }

  // - - - - - - - - --  - - - - - - - - - -   - - - - - - - - --  -- - - - - Funciones para mostrar la asesoría - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Funciones para mostrar una asesoría 
  showModalViewConsultation(consultation: Consultation): void{
    // Bandera 
    this.flag_show_view_consultation = true;
    // Inicializamos el componente hijo 
    this.viewConsultationComponent.initComponent(consultation.uuid || '');
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones del modal para eliminar una asesoría - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Mostrar modal de confirmación de eliminación 
  showConfirmation(consultation: Consultation): void{
    // Creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: `Estás a punto de eliminar la asesoría sobre ${consultation.subject.name.toUpperCase()} del asesor ${consultation.user.first_name.toUpperCase()} 
      ${consultation.user.last_name.toUpperCase()}, ¿Deseas continuar?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.deleteConsultation(consultation);
      },
      reject: (type: any) => {}
    });
  }

  // Eliminar asesoría 
  deleteConsultation(consultation: Consultation): void{
    // Bandera
    this.flag_loading = true; 
    // Consultamos el servicio de CONSULTATIONS 
    this.consultationsService.delete(consultation.uuid || '').subscribe({
      next: (resp: deleteConsultationResponse) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Reiniciamos las asesorías 
        this.findAllConsultations();
        // loading 
        this.flag_loading = false;
      },
      error: (error) => {
        //Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // loading 
        this.flag_loading = false;
      }
    });
  }
}