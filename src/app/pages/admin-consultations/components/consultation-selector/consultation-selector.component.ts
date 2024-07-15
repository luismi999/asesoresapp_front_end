import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { Subject } from 'src/app/model/subject.model';

// Servicios 
import { ConsultationsService } from '../../../../services/consultations.service';
import { SubjectsService } from '../../../../services/subjects.service';

@Component({
  selector: 'app-consultation-selector',
  templateUrl: './consultation-selector.component.html',
  styleUrls: ['./consultation-selector.component.css']
})
export class ConsultationSelectorComponent implements OnInit, OnDestroy {

  // Salidas 
  @Output() set_consultations        = new EventEmitter<Consultation[]>();
  @Output() set_reload_consultations = new EventEmitter<void>();

  // Propiedades 
  consultations: Consultation[] = [];
  subjects    : Subject[] = [];

  // Banderas 
  loading_flag: boolean = false;

  // Suscripciones 
  sub_find_all_consultations?: Subscription;
  sub_find_all_subjects     ?: Subscription;

  // Constructor 
  constructor(
    private consultationsService: ConsultationsService,
    private subjectsService     : SubjectsService
  ){}

  // Inicializado 
  ngOnInit(): void {
    this.get_subjects();
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_find_all_consultations?.unsubscribe();
    this.sub_find_all_subjects?.unsubscribe();
  }

  // Obtener cátedras 
  get_subjects(): void{
    // Reiniciamos nuestra variable 
    this.subjects = [];
    // Consultamos al servicio de SUBJECTS 
    this.sub_find_all_subjects = this.subjectsService.findAll().subscribe({
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
  find_consultations_by_subject(event: any): void{
    // Cargando 
    this.loading_flag = true;
    // Obtenemos el valor del selector 
    const subject = event.target.value.toLowerCase();
    // Reiniciamos la variable de consultations 
    this.consultations = [];
    if(subject != 'novalue'){
      this.sub_find_all_consultations = this.consultationsService.findAll().subscribe({
        next: (resp: Consultation[]) => {
          // Mapeamos la respuesta del backend 
          resp.map((con: Consultation) => {
            // Si la asesoría coincide con la materia 
            if(con.subject.name == subject)
              this.consultations.push(con); 
          });
          // Actualizamos las asesorías 
          this.set_consultations.emit(this.consultations);
          // Cargando 
          this.loading_flag = false;
        },
        error: (error) => {
          // Respuesta del back 
          console.log(error.error.message);
          // Cargando 
          this.loading_flag = false;
        }
      });
    }
    else if(subject == 'novalue'){
      // Emitimos el evento 
      this.set_reload_consultations.emit();
      // Cargando 
      this.loading_flag = false;
    }
  }
}