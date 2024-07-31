import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Modelos 
import { Join } from 'src/app/model/join.model';

// Servicios 
import { JoinsService } from '../../../../services/joins.service';
import { ConsultationsService } from 'src/app/services/consultations.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { UpdateJoinResponse } from 'src/app/model/updateJoinResponse.interface';


@Component({
  selector: 'app-grade-join',
  templateUrl: './grade-join.component.html',
  styleUrls: ['./grade-join.component.css'],
  providers: [ MessageService ]
})
export class GradeJoinComponent {

  @Output() refresh_joins = new EventEmitter<void>();

  // Propiedades 
  consultation!: any;
  form        !: FormGroup;
  grades      ?: number[];
  join        ?: Join;
  flag        : boolean = false;

  // Banderas 
  flag_loading: boolean = false;

  // Suscripciones
  sub_consultation_find_one?: Subscription; 

  // Constructor 
  constructor( 
    private fb                  : FormBuilder, 
    private messageService      : MessageService,
    private consultationsService: ConsultationsService,
    private joinsService        : JoinsService ){}

  // Inicializado 
  ngOnInit(): void {
    this.grades = this.joinsService.getGrades();
    this.init_form();
  }

  // Destructor
  ngOnDestroy(): void {
    this.sub_consultation_find_one?.unsubscribe();
  } 

  // Inicializar componente 
  start_component(join: Join){
    this.flag = true;
    this.join = join;
    this.find_consultation(join);
  }

  // Inicializar el formulario para calificar el join
  init_form(): void{
    this.form = this.fb.group({
      grade: [0,[Validators.min(1), Validators.max(10), Validators.required],],
      comment: ["Ejemplo: 'Vaya asesor, me ayudó mucho en como realizar modelos entidad relación.'",[Validators.minLength(10), Validators.maxLength(200), Validators.required]]
    });
  }

  // Buscar la asesoría del join 
  find_consultation(join: Join): void{
    // Bandera 
    this.flag_loading = true;
    // Consultamos el servicio de CONSULTATIONS 
    this.consultationsService.findOne(join.consultation?.uuid || '')
    .subscribe({
      next: (resp: Consultation) => {
        // Guardamos la respuesta en una variable 
        this.consultation = resp;
        // Bandera 
        this.flag_loading = false;
      }, error: (error) => {
        // Mostramos la respuesta
        console.log(error.error.message);
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Actualizamos el join 
  update_join(): void{
    // Bandera 
    this.flag_loading = true;
    // Consultamos el servicio de JOINS 
    this.joinsService.updateJoinGrade(this.join!.uuid, this.form.value).subscribe({
      next: (resp: UpdateJoinResponse) => {
        // Respuesta del backend
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success',detail: resp.msg, life: 5000 });
        // Reiniciamos el formulario 
        this.form.reset();
        // Bandera del modal 
        this.close_modal();
        // Bandera 
        this.flag_loading = false;
        // Actualizamos los joins 
        this.refresh_joins.emit();
      },
      error: (error) => {
        // Respuesta del backend 
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error',detail: error.error.message, life: 5000 });
        // Reiniciamos el formulario 
        this.form.reset();
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Cerrar modal 
  close_modal(){
    // this.flag_response.emit(false);
    this.flag = false;
  }
}
