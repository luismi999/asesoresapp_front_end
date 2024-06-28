import { Component, ViewChild } from '@angular/core';

// Modelos
import { Consultation } from 'src/app/model/consultation.model';
import { User } from 'src/app/model/user.model';
import { Join } from 'src/app/model/join.model';
import { Subject } from 'src/app/model/subject.model';

// Interfaces 
import { CreateJoin } from 'src/app/model/createJoin.interface';
import { CreateJoinResponse } from 'src/app/model/createJoinResponse.interface';

// Servicios
import { AuthService } from '../../services/auth.service';
import { JoinsService } from '../../services/joins.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SubjectsService } from '../../services/subjects.service';
import { ConsultationsService } from '../../services/consultations.service';

// Componentes hijos 
import { ViewConsultationComponent } from 'src/app/components/view-consultation/view-consultation.component';
import { ViewUserAdvisorComponent } from 'src/app/components/view-user-advisor/view-user-advisor.component';


@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.component.html',
  styleUrls: ['./consultations.component.css'],
  providers: [ MessageService, ConfirmationService ]
})
export class ConsultationsComponent {

  @ViewChild(ViewConsultationComponent) viewConsultationComponent!: ViewConsultationComponent;
  @ViewChild(ViewUserAdvisorComponent) ViewUserAdvisorComponent!: ViewUserAdvisorComponent;

  // Propiedades generales
  user    ?: User;
  subjects?: Subject[] = [];
  joins   ?: Join[]    = []; 

  // Propiedades de la tabla de asesorías 
  consultations: Consultation[] = [];

  // Banderas de los modales
  flag_view_consultation: boolean = false;
  flag_loading          : boolean = false;
  flag_show_user        : boolean = false;
  
  // Constructor
  constructor(
    private authService         : AuthService,
    private subjectsService     : SubjectsService,
    private confirmationService : ConfirmationService,
    private consultationsService: ConsultationsService,
    private messageService      : MessageService,
    private joinsService        : JoinsService){}
    
  // Inicializado
  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.getSubjects();
    this.findAllMyJoins();
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones de la tabla de asesoramientos - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Obtener cátedras 
  getSubjects(): void{
    // Reiniciamos nuestra variable 
    this.subjects = [];
    // Consultamos al servicio de SUBJECTS 
    this.subjectsService.findAll()
    .subscribe({
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

  // Buscar todos mis joins para poder filtrarlos en las asesorías a mostrar 
  findAllMyJoins(): void{
    // Bandera 
    this.flag_loading = true;
    // Consultar el servicio JOINS
    this.joinsService.findAllByUser(this.user?.uuid || '')
    .subscribe({
      next: (resp: Join[]) => {
        // Guardamos nuestros joins en una variable 
        this.joins = resp;
        // Obtenemos las asesorías 
        this.findAllConsultations();
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
  findAllConsultations(): void{
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
          // Obtenemos solo las asesorías activas 
          if(con.isActive){
            this.consultations.push(con);
          }
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

  // Buscamos las asesorías por cátedra
  filterConsultationsBySubject(event: any): void{
    // Bandera 
    this.flag_loading = true;
    // Obtenemos el valor del selector 
    const uuid_subject = event.target.value.toLowerCase();
    // Reiniciamos la variable de consultations 
    this.consultations = [];
    // Sí recibimos un "noValue" Significa que el usuario quiere buscar todas las asesorías disponibles 
    if(uuid_subject == 'novalue'){
      // Consultamos el servicio de CONSULTATIONS 
      this.consultationsService.findAll()
      .subscribe({
        next: (resp: Consultation[]) => {
          // Guardamos las asesorías 
          this.consultations = resp;
          // Bandera 
          this.flag_loading = false;
        },
        error: (error) =>{
          // Respuesta
          console.log(error.error.message);
          // Bandera 
          this.flag_loading = false;
        }
      });
    } else {
      // Consultamos el servicio de CONSULTATIONS 
      this.consultationsService.findAllBySubject(uuid_subject)
      .subscribe({
        next: (resp: Consultation[]) => {
          // Guardamos las asesorías 
          this.consultations = resp;
          // Bandera 
          this.flag_loading = false;
        },
        error: (error) =>{
          // Respuesta
          console.log(error.error.message);
          // Bandera 
          this.flag_loading = false;
        }
      })
    }
  }

  //  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones del modal para visualizar una asesoría - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Mostrar el modal de la vista de la asesoría 
  showModalViewConsultation(consultation: Consultation): void{
    // Bandera 
    this.flag_view_consultation = true;
    // Inicializamos el componente 
    this.viewConsultationComponent.initComponent(consultation.uuid || '');
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Funciones del modal para crear un join - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // Confirmación para la creación del join en una asesoría seleccionada
  showConfirmation(consultation: Consultation): void{
    // Creamos el mensaje de la confirmación 
    this.confirmationService.confirm({
      message: `¿Deseas unirte al asesoramiento sobre ${consultation.subject.name.toUpperCase()}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Si',
      accept: () => {
        // Actualizamos la asesoría 
        this.createJoin(consultation);
      },
      reject: (type: any) => {}
    });
  }

  // Creamos el join para la asesoría seleccionada una vez confirmada
  createJoin(consultation: Consultation): void{
    // Bandera 
    this.flag_loading = true;
    // Creamos el modelo para crear el join 
    const newJoin: CreateJoin = {uuid_user: this.user?.uuid || '', uuid_consultation: consultation?.uuid};
    // consultamos el servicio de JOINS
    this.joinsService.create(newJoin)
    .subscribe({
      next: (resp: CreateJoinResponse) => {
        // Respuesta del backend
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000 });
        // Reiniciamos la tabla 
        this.findAllMyJoins();
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta del backend
        this.messageService.add({key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000 });
        // Bandera 
        this.flag_loading = false;
      }
    })
  }

  // - - - - - - - - - - - - - - - - - - - Funciones para mostrar detalles del asesor - - - - - - - - - - - - - -
  
  // Mostrar el modal para visualizar los datos del usuario seleccionado 
  showUser(consultation: Consultation): void{
    // Bandera 
    this.flag_show_user = true;
    // Inicializamos el componente hijo 
    this.ViewUserAdvisorComponent.findUser(consultation.user?.uuid || '');
  }
}
