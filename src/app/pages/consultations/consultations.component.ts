import { Component, ViewChild } from '@angular/core';

// Modelos
import { Consultation } from 'src/app/model/consultation.model';
import { User } from 'src/app/model/user.model';
import { Join } from 'src/app/model/join.model';

// Servicios
import { AuthService } from '../../services/auth.service';
import { JoinsService } from '../../services/joins.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConsultationsService } from '../../services/consultations.service';

// Componentes hijos 
import { ViewConsultationComponent } from 'src/app/components/view-consultation/view-consultation.component';
import { ViewUserAdvisorComponent } from 'src/app/components/view-user-advisor/view-user-advisor.component';
import { CreateJoinComponent } from './components/create-join/create-join.component';
import { ChartConsultationsStudentComponent } from './components/chart-consultations-student/chart-consultations-student.component';


@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class ConsultationsComponent {

  // Componentes hijos 
  @ViewChild(ChartConsultationsStudentComponent) chartConsultationsStudentComponent!: ChartConsultationsStudentComponent;
  @ViewChild(ViewConsultationComponent) viewConsultationComponent!: ViewConsultationComponent;
  @ViewChild(ViewUserAdvisorComponent) viewUserAdvisorComponent!: ViewUserAdvisorComponent;
  @ViewChild(CreateJoinComponent) createJoinComponent!: CreateJoinComponent;

  // Propiedades generales
  user         ?: User;
  joins        : Join[] = []; 
  consultations: Consultation[] = [];

  // Banderas de los modales
  flag_view_consultation: boolean = false;
  flag_loading          : boolean = false;
  flag_show_user        : boolean = false;
  
  // Constructor
  constructor(
    private authService         : AuthService,
    private consultationsService: ConsultationsService,
    private joinsService        : JoinsService){}
    
  // Inicializado
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.find_all_my_joins();
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones de la tabla de asesoramientos - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Buscar todos mis joins para poder filtrarlos en las asesorías a mostrar 
  find_all_my_joins(): void{
    // Bandera 
    this.flag_loading = true;
    // Consultar el servicio JOINS
    this.joinsService.findAllByUser(this.user?.uuid || '')
    .subscribe({
      next: (resp: Join[]) => {
        // Guardamos nuestros joins en una variable 
        this.joins = resp;
        // Obtenemos las asesorías 
        this.find_all_consultations();
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

  // buscamos todas las asesorías
  find_all_consultations(): void{
    // Bandera 
    this.flag_loading = true;
    // Reiniciamos la variable de todas las asesorías
    this.consultations = [];
    // consultamos al servicio de CONSULTATIONS
    this.consultationsService.findAll()
    .subscribe({
      next: (resp: Consultation[]) => {
        // Mapeamos la respuesta 
        resp.map((con: Consultation) => {
          this.consultations.push(con);
        });
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

  // Observamos si ya contamos con un join creado y lo señalamos como JOINED
  check(consultation: Consultation): boolean{
    // Si la asesoría ya tiene un join de nosotros retornamos un false 
    const alreadyJoined = this.joins?.some(join => join.consultation?.uuid == consultation.uuid);
    if(alreadyJoined)
      return true;
    return false; 
  }

  
  // -------------------------------------------------------------------- componente hijo (view consultation) ---------------------------------------------------
  
  // Mostrar el modal de la vista de la asesoría 
  show_modal_view_consultation(consultation: Consultation): void{
    // Bandera 
    this.flag_view_consultation = true;
    // Inicializamos el componente 
    this.viewConsultationComponent.initComponent(consultation.uuid || '');
  }
  // --------------------------------------------------------------------- componente hijo (view user) -----------------------------------------------------------
  
  // Mostrar el modal para visualizar los datos del usuario seleccionado 
  show_modal_view_user(user: User): void{
    // Bandera 
    this.flag_show_user = true;
    // Inicializamos el componente hijo 
    this.viewUserAdvisorComponent.findUser(user.uuid || '');
  }

  // --------------------------------------------------------------------- componente hijo (create join) -----------------------------------------------------------
  show_confirmation_create_join(consultation: Consultation){
    this.createJoinComponent.start_component(consultation);
  }
}