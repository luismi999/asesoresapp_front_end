import { Component, ViewChild } from '@angular/core';

// Modelos
import { User } from 'src/app/model/user.model';
import { Consultation } from './../../model/consultation.model';

// Servicios
import { AuthService } from '../../services/auth.service';
import { ConsultationsService } from '../../services/consultations.service';
import { ConfirmationService, MessageService } from 'primeng/api';

// Componentes hijos 
import { ViewJoinsComponent } from './components/view-joins/view-joins.component';
import { CreateConsultationComponent } from './components/create-consultation/create-consultation.component';
import { ViewConsultationComponent } from 'src/app/components/view-consultation/view-consultation.component';
import { ProgressBarConsultationsComponent } from 'src/app/components/progress-bar-consultations/progress-bar-consultations.component';
import { ViewUserAdvisorComponent } from 'src/app/components/view-user-advisor/view-user-advisor.component';
import { UpdateConsultationResponse } from 'src/app/model/updateConsultationResponse.interface';

@Component({
  selector: 'app-my-consultations',
  templateUrl: './my-consultations.component.html',
  styleUrls: ['./my-consultations.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class MyConsultationsComponent {

  // Componentes hijos 
  @ViewChild(ViewJoinsComponent) viewJoinsComponent                              !: ViewJoinsComponent;
  @ViewChild(ViewUserAdvisorComponent) viewUserAdvisorComponent                  !: ViewUserAdvisorComponent;
  @ViewChild(ViewConsultationComponent) viewConsultationComponent                !: ViewConsultationComponent;
  @ViewChild(CreateConsultationComponent) createConsultationComponent            !: CreateConsultationComponent;
  @ViewChild(ProgressBarConsultationsComponent) progressBarConsultationsComponent!: ProgressBarConsultationsComponent;

  // Propiedades generales
  user: User | undefined;

  // Propiedades para la tabla de asesorías
  consultations           : Consultation[] = [];
  ActiveConsultationsCount: number = 0;

  // Banderas de los componentes hijos
  flag_create_consultation: boolean = false;
  flag_view_consultation  : boolean = false;
  flag_view_joins         : boolean = false;
  flag_view_user          : boolean = false;
  flag_loading            : boolean = false;

  // Constructor
  constructor(
    private authService         : AuthService,
    private consultationsService: ConsultationsService,
    private confirmationService : ConfirmationService,
    private messageService      : MessageService){}

  // Iniciador
  ngOnInit(): void{
    this.get_user();
    this.find_all_consultations_by_user();
  }
  
  // Obtener el usuario 
  get_user(): void{
    this.user = this.authService.getUser();
  }

  //  - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - -  Funciones de la tabla de asesorías - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Buscar asesorías por usuario 
  find_all_consultations_by_user(): void{
    // Cargando 
    this.flag_loading = true;
    // Buscamos todas las asesorías del usuario
    this.consultationsService.findAllByUser(this.user?.uuid || "")
    .subscribe({
      next: (resp: Consultation[]) => {
        // Guardamos las asesorías obtenidas 
        this.consultations = resp;
        // Obtenemos la cuenta de las asesorías activas 
        this.get_active_consultations_count(resp);
        // Refrescamos la barra de progreso 
        this.progressBarConsultationsComponent.refresh();
        // Cargando 
        this.flag_loading = false;
      },
      error: (error: any) => {
        // Respuesta
        console.log(error.error.message);
        // Cargando 
        this.flag_loading = false;
      }
    }); 
  }

  // Obtener el numero de asesorías activas 
  get_active_consultations_count(consultations: Consultation[]){
    // Reiniciamos la cuenta 
    this.ActiveConsultationsCount = 0;
    // Mapeamos las asesorías 
    consultations.map((consultation: Consultation) => {
      if(consultation.isActive)
        this.ActiveConsultationsCount++;
    });
  }

  // --------------------------------------------------------------------------- Componente hijo (crear) -------------------------------------------------------------------- 

  // Mostrar el modal de creación de asesoría
  show_modal_create_consultation(): void{
    // Bandera 
    this.flag_create_consultation = true;
    // Inicializamos el componente 
    this.createConsultationComponent.initComponent();
  }

  // ------------------------------------------------------------------------- Componente hijo (ver sensoria) --------------------------------------------------------------

  // Mostrar el modal de vista de asesoría
  show_modal_view_consultation(consultation: Consultation): void{
    // Levantamos la bandera 
    this.flag_view_consultation = true;
    // Inicializamos el componente 
    this.viewConsultationComponent.initComponent(consultation.uuid || '');
  }

  // ---------------------------------------------------------------------------- Componente hijo (ver asesor) -------------------------------------------------------------

  // Mostrar el modal de vista de usuario 
  show_modal_view_user(user: any): void{
    // Bandera 
    this.flag_view_user = true;
    // Inicializamos el componente 
    this.viewUserAdvisorComponent.initComponent(user.uuid);
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones del modal para ver las joins de un asesoramiento - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  // Mostrar el modal de vista de joins 
  showModalViewJoins(consultation: Consultation): void{
    // Bandera 
    this.flag_view_joins = true;
    // Inicializamos el componente  
    this.viewJoinsComponent.initComponent(consultation);
  }


  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones del modal para confirmar la eliminación de una asesoría - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  showConfirmationToDelete(consultation: Consultation): void{
    // creamos el contenido de la confirmación 
    this.confirmationService.confirm({
      message: `¿Deseas eliminar tu asesoría de ${consultation.subject.name.toUpperCase()}?`,
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

  deleteConsultation(consultation: Consultation): void{
    // Bandera 
    this.flag_loading = true;
    // Consulta al servicio CONSULTATIONS 
    this.consultationsService.delete(consultation.uuid || '').subscribe({
      next: (resp: UpdateConsultationResponse) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Actualizamos las asesorías dentro de nuestra tabla 
        this.find_all_consultations_by_user();
        // Refrescamos la barra de progreso 
        this.progressBarConsultationsComponent.refresh()
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error',detail: error.error.message, life: 5000 });
        // Bandera 
        this.flag_loading = false;
      }
    });
  }
} 