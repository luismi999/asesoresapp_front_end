import { Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { User } from 'src/app/model/user.model';

// Servicios 
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultationsService } from 'src/app/services/consultations.service';
import { AuthService } from 'src/app/services/auth.service';

// Componentes hijos 
import { DeleteConsultationComponent } from './components/delete-consultation/delete-consultation.component';
import { ViewConsultationComponent } from '../../components/view-consultation/view-consultation.component';
import { ViewUserAdvisorComponent } from 'src/app/components/view-user-advisor/view-user-advisor.component';

@Component({
  selector: 'app-admin-consultations',
  templateUrl: './admin-consultations.component.html',
  styleUrls: ['./admin-consultations.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class AdminConsultationsComponent {

  @ViewChild(DeleteConsultationComponent) deleteConsultationComponent!: DeleteConsultationComponent;
  @ViewChild(ViewConsultationComponent) viewConsultationComponent!: ViewConsultationComponent;
  @ViewChild(ViewUserAdvisorComponent) viewUserAdvisorComponent!: ViewUserAdvisorComponent;

  // Propiedades 
  my_user?: User;

  // Propiedades de la tabla de asesorías 
  all_consultations           : Consultation[] = [];

  // Banderas de los modales
  flag_show_view_consultation: boolean = false;
  flag_show_view_user_advisor: boolean = false;
  flag_loading               : boolean = false;

  // Suscripciones
  sub_consultation_find_all?: Subscription;

  // Constructor
  constructor(
    private authService         : AuthService,
    private consultationsService: ConsultationsService
  ){}
    
  // Inicializado
  ngOnInit(): void {
    this.my_user = this.authService.getUser();
    this.find_all_consultations();
  }

  // Destructor
  ngOnDestroy(): void {
    this.sub_consultation_find_all?.unsubscribe();
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones de la tabla de asesoramientos - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // buscamos todas las asesorías
  find_all_consultations(): void{
    // Cargando 
    this.flag_loading = true;
    // Reiniciamos la variable 
    this.all_consultations = [];
    // consultamos al servicio de CONSULTATIONS
    this.sub_consultation_find_all = this.consultationsService.findAll().subscribe({
      next: (resp: Consultation[]) => {
        // Guardamos las asesorías recibidas en nuestras variables 
        this.all_consultations = resp;
        // this.all_consultations_by_subject = resp;
        // Cargando 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta
        console.log(error.error.message);
        // Cargando 
        this.flag_loading = false;
      }
    });
  }

  // ------------------------------------------------------------------------ Componente hijo (ver asesoría) -------------------------------------------------

  // Funciones para mostrar una asesoría 
  show_modal_view_consultation(consultation: Consultation): void{
    // Bandera 
    this.flag_show_view_consultation = true;
    // Inicializamos el componente hijo 
    this.viewConsultationComponent.initComponent(consultation.uuid);
  }

  // ------------------------------------------------------------------------- Componente hijo (ver asesor) -------------------------------------------------

  show_modal_view_user(user: User): void{
    // Bandera 
    this.flag_show_view_user_advisor = true;
    // Inicializamos el componente hijo 
    this.viewUserAdvisorComponent.initComponent(user.uuid);
  }

  // --------------------------------------------------------------------- Componente hijo (Eliminar asesoría) ----------------------------------------------

  show_modal_delete_consultation(consultation: Consultation){
    // Inicializamos el componente hijo 
    this.deleteConsultationComponent.start_component(consultation);
  }
}