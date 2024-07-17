import { Component, ViewChild } from '@angular/core';

// Modelos
import { Join } from 'src/app/model/join.model';
import { User } from 'src/app/model/user.model';
import { Consultation } from 'src/app/model/consultation.model';

// Servicios
import { JoinsService } from '../../services/joins.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { ConsultationsService } from '../../services/consultations.service';

// Componentes hijos 
import { ViewConsultationComponent } from '../../components/view-consultation/view-consultation.component';
import { GradeJoinComponent } from './components/grade-join/grade-join.component';
import { ViewUserAdvisorComponent } from 'src/app/components/view-user-advisor/view-user-advisor.component';

@Component({
  selector: 'app-my-joins',
  templateUrl: './my-joins.component.html',
  styleUrls: ['./my-joins.component.css'],
  providers: [ MessageService ]
})
export class MyJoinsComponent {

  @ViewChild(ViewConsultationComponent) viewConsultationComponent!: ViewConsultationComponent;
  @ViewChild(ViewUserAdvisorComponent) viewUserAdvisorComponent!: ViewUserAdvisorComponent;
  @ViewChild(GradeJoinComponent) gradeJoinComponent !: GradeJoinComponent;

  // Propiedades
  user              ?: User;
  found_join        ?: Join;
  
  // Propiedades para la tabla de joins
  joins: Join[] = [];

  // Banderas
  flag_show_consultation: boolean = false;  
  flag_show_update_join : boolean = false;
  flag_show_user        : boolean = false;
  flag_loading          : boolean = false;

  // Constructor
  constructor(
    private joinsService        : JoinsService,
    private consultationService : ConsultationsService,
    private authService         : AuthService){}

  // Inicializado
  ngOnInit(): void{
    this.user = this.authService.getUser();
    this.findAllJoins();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones de la tabla de joins - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Buscar todos mis joins
  findAllJoins(): void{
    // Bandera 
    this.flag_loading = true;
    // Limpiamos los joins 
    this.joins = [];
    // Consultamos al servicio JOINS
    this.joinsService.findAllByUser(this.user?.uuid || '')
    .subscribe({
      next: async (resp: Join[]) => {
        // Guardamos la respuesta en una variable del componente
        this.joins = resp;
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta del backend
        console.log(error.error.message);
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones del modal para ver los detalles de un join - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Mostrar el modal para mostrar el join 
  showModalViewConsultation(join: Join): void{
    // Bandera 
    this.flag_show_consultation = true;
    // Inicializamos el componente 
    this.viewConsultationComponent.initComponent(join.consultation.uuid || '');
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones para el modal de calificar el join - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  
  // Mostrar el modal para calificar el join 
  showModalGradeJoin(join: Join): void{
    // Guardamos el join seleccionado 
    this.found_join = join;
    // Inicializamos el componente para calificar el join 
    this.gradeJoinComponent.findConsultation(join);
    // Bandera 
    setTimeout(() => {
      this.flag_show_update_join = true;
    }, 500);
  }

   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones para mostrar detalles del asesor - - -- - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  // Mostrar el modal para visualizar los datos del usuario seleccionado 
  showUser(join: Join): void{
    // Bandera 
    this.flag_show_user = true;
    // Creamos la variable para la asesoría 
    let consultation: Consultation | undefined = undefined;
    // Consultamos el servicio CONSULTATIONS 
    this.consultationService.findOne(join.consultation.uuid)
    .subscribe({
      next: (resp: Consultation) => {
        // Bandera
        this.flag_loading = false;
        // Guardamos la asesoría
        consultation = resp;
        // Inicializamos el componente hijo 
        this.viewUserAdvisorComponent.initComponent(consultation.user.uuid);
      },
      error: (error) => {
        // Bandera
        this.flag_loading = false;
        // Respuesta del backend
        console.log(error.error.message);
      }
    });
  }
}
