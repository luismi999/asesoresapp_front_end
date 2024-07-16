import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

// Modelos 
import { Subject } from 'src/app/model/subject.model';
import { Consultation } from 'src/app/model/consultation.model';

// Servicios 
import { SubjectsService } from '../../../../services/subjects.service';
import { ConsultationsService } from '../../../../services/consultations.service';

@Component({
  selector: 'app-consultation-selector-student',
  templateUrl: './consultation-selector-student.component.html',
  styleUrls: ['./consultation-selector-student.component.css']
})
export class ConsultationSelectorStudentComponent implements OnInit, OnDestroy {

  // Salidas 
  @Output() set_consultations        = new EventEmitter<Consultation[]>();
  @Output() set_reload_consultations = new EventEmitter<void>();

  // Propiedades 
  subjects     : Subject[]      = [];
  consultations: Consultation[] = [];

  // Banderas 
  loading_flag: boolean = false;

  // Suscripciones 
  sub_find_consultations?: Subscription;

  // Constructor 
  constructor(
    private subjectsService     : SubjectsService,
    private consultationsService: ConsultationsService,
  ) {}

  // Inicializado 
  ngOnInit(): void {
    this.start_component();
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_find_consultations?.unsubscribe();
  }

  // Inicializar componente 
  start_component(){
    this.get_subjects();
  }

  // Obtener cátedras 
  get_subjects(): void{
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

  // Buscamos las asesorías por cátedra
  get_consultations_by_subject(event: any): void{
    // Cargando 
    this.loading_flag = true;
    // Obtenemos el valor del selector 
    const subject_uuid = event.target.value.toLowerCase();
    // Reiniciamos la variable de consultations 
    this.consultations = [];
    // Consultamos el servicio de CONSULTATIONS 
    if(subject_uuid != 'novalue'){
      this.sub_find_consultations = this.consultationsService.findAllBySubject(subject_uuid)
      .subscribe({
        next: (resp: Consultation[]) => {
          // Guardamos las asesorías 
          this.consultations = resp;
          // Actualizamos las asesorías en el componente padre 
          this.set_consultations.emit(this.consultations);
          // Cargando 
          this.loading_flag = false;
        },
        error: (error) =>{
          // Respuesta
          console.log(error.error.message);
          // Cargando 
          this.loading_flag = false;
        }
      });
    }else{
      // Actualizamos las asesorías 
      this.set_reload_consultations.emit();
      // Cargando 
      this.loading_flag = false;
    }
  }
}