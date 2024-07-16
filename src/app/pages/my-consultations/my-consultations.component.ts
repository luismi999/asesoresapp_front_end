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
import { DeleteMyConsultationComponent } from './components/delete-my-consultation/delete-my-consultation.component';

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
  @ViewChild(DeleteMyConsultationComponent) deleteMyConsultationComponent        !: DeleteMyConsultationComponent;
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
  
  // ---------------------------------------------------------------------------- Componente hijo (delete user) ------------------------------------------------------------------- 
  show_modal_delete_consultation(consultation: Consultation) {
    this.deleteMyConsultationComponent.start_component(consultation);
  }
} 