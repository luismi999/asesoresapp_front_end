import { Component, EventEmitter, Input, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as mapboxgl from 'mapbox-gl';

// Servicios 
import { ConsultationsService } from 'src/app/services/consultations.service';
import { SubjectsService } from 'src/app/services/subjects.service';
import { MessageService } from 'primeng/api';

// Modelos 
import { User } from 'src/app/model/user.model';

// Interfaces 
import { CreateConsultation } from 'src/app/model/createConsultation.interface';
import { CreateConsultationResponse } from 'src/app/model/createConsultationResponse.interface';

@Component({
  selector: 'app-create-consultation',
  templateUrl: './create-consultation.component.html',
  styleUrls: ['./create-consultation.component.css'],
  providers: [ MessageService ]
})
export class CreateConsultationComponent {

  // Inputs y outputs del componente  
  @Input() flag!: boolean;
  @Input() user!: User | undefined;

  @Output() flag_response = new EventEmitter<boolean>();
  @Output() get_consultations_event = new EventEmitter<void>();

  // Propiedades 
  form      !: FormGroup;
  subjects  ?: any[];
  hours     ?: number[];
  start_hours: number[] = [];
  end_hours  : number[] = [];
  days      ?: string[];
  map       ?: mapboxgl.Map;
  mark      ?: mapboxgl.Marker;

  // Banderas 
  flag_loading: boolean = false;

  // Constructor
  constructor( 
    private fb                  : FormBuilder,
    private messageService      : MessageService,
    private subjectsService     : SubjectsService,
    private consultationsService: ConsultationsService, ){}

  // Inicializa
  ngOnInit(): void {
    this.initForm();
    this.days = this.consultationsService.days;
    this.hours = this.consultationsService.hours;
  }

  // Inicializado de componente 
  initComponent(): void {
    // Inicializamos el formulario y las cátedras 
    this.initForm();
    this.getSubjects();
    // Inicializamos el mapa 
    setTimeout(() => {
      this.initMap();
    }, 100);
  }

  // Inicializar el formulario para crear una asesoría
  initForm(): void{
    this.form = this.fb.group({
      uuid_subject: ['',[Validators.required]],
      day         : ['',[Validators.required]],
      start       : ['',[Validators.required]],
      end         : ['',[Validators.required]],
      map_longitud: [''],
      map_latitud : ['']
    });
  }

  // Obtener cátedras 
  getSubjects(): void{
    // Bandera 
    this.flag_loading = true;
    // Reiniciamos nuestra variable 
    this.subjects = [];
    // Consultamos al servicio de SUBJECTS 
    this.subjectsService.findAll()
    .subscribe({
      next: (resp: any) => {
        // Guardamos la respuesta en la variable de cátedras 
        this.subjects = resp;
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Retornamos 
        console.log(error.error.message);
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Obtener la hora de fín 
  getEndHours(event: any): void{
    // Obtenemos la hora seleccionada 
    let selectedHour = event.target.value;
    // Reiniciamos las horas de fin 
    this.end_hours = [];
    // Convertimos la hora a numero 
    selectedHour = parseInt(selectedHour);
    // Mapeamos las horas 
    this.hours?.map((hour: number) => {
      // Si la hora es mayor a la seleccionada la añadimos al array de horas
      if(hour > selectedHour)
        this.end_hours.push(hour);
    });
  }

  // Inicializar el mapa para creación de asesoría
  initMap(): void{
    // API KEY
    (mapboxgl as any).accessToken = import.meta.env.NG_APP_MAPBOX_KEY;
    // Creamos el mapa
    this.map = new mapboxgl.Map({
      container: 'mapForCreate',
      style: `${import.meta.env.NG_APP_MAPBOX_STYLE}`,
      center: [-103.325930, 20.655824],
      zoom: 18,
    });
    // Colocamos el botón para fullscreen
    this.map.addControl(new mapboxgl.FullscreenControl());
    // Colocamos el botón de globalización
    this.map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      })
    );
    // Creamos el marcador
    this.mark = new mapboxgl.Marker({
      draggable: true,
      color: "#C70039",
    })
    .setLngLat([-103.325930, 20.655824])
    .addTo(this.map);
  }

  // Crear asesoría
  createConsultation(): void{
    // Bandera 
    this.flag_loading = true;
    // Obtenemos la latitud y longitud del marcador dentro del mapa 
    const long = this.mark?.getLngLat().lng;
    const lat  = this.mark?.getLngLat().lat;
    // Guardamos la longitud y latitud obtenidos del mapa en el formulario
    this.form.get('map_longitud')?.setValue(long);
    this.form.get('map_latitud')?.setValue(lat);
    // Creamos una variable "asesoría" con los valores del formulario
    const newConsultation: CreateConsultation = this.form.value;
    newConsultation.uuid_user = this.user?.uuid;
    // Consulta al servicio CONSULTATIONS
    this.consultationsService.create(newConsultation)
    .subscribe({
      next: (resp: CreateConsultationResponse) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000});
        // Obtenemos nuevamente todas las asesorías 
        this.getConsultations();
        // Cerramos modal 
        this.closeModal();
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000});
        // Bandera 
        this.flag_loading = false;
      }
    });
    // Bandera 
    this.flag = false;
    // Reiniciamos el formulario de creación
    this.form.reset();
  }

  // Obtener todas las asesorías 
  getConsultations(): void{
    this.get_consultations_event.emit();
  }

  // Cerrar modal 
  closeModal(): void{
    this.flag_response.emit(false);
  }
}
