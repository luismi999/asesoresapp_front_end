import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';

// Servicios
import { ConsultationsService } from 'src/app/services/consultations.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {
  // Propiedades 
  map !: mapboxgl.Map;  
  mark!: mapboxgl.Marker;

  // Propiedades 
  all_consultations     ?: Consultation[];
  active_consultations  ?: Consultation[];
  inactive_consultations?: Consultation[];

  rotationAngle         : number = 0;

  // Constructor
  constructor(private consultationsService: ConsultationsService){}

  // Inicializado 
  ngOnInit(): void {
    this.findAllConsultations();
  }

  // Buscamos todas las asesorías
  findAllConsultations(): void{
    // Consultamos al servicio de CONSULTATIONS
    this.consultationsService.findAll().subscribe({
      next: (resp: Consultation[]) => {
        // Guardamos la respuesta en nuestra variable 
        this.all_consultations = resp;
        // Inicializamos el mapa 
        setTimeout(() => {
          this.initMap();
          this.animateRotation();
        }, 500);
      },
      error: (error) => {
        // Respuesta del backend
        console.log(error.error.message);
      }
    });
  }

  // Inicializar el mapa para creación de asesoría
  initMap(): void{
    // API KEY
    (mapboxgl as any).accessToken = import.meta.env.NG_APP_MAPBOX_KEY;
    // Creamos el mapa
    this.map = new mapboxgl.Map({
      container: 'map',
      style: import.meta.env.NG_APP_MAPBOX_STYLE,
      // center: [-103.324367, 20.656952],
      center: [-103.325885, 20.657269],
      pitch: 45,
      zoom: 17,
      scrollZoom: false,
      interactive: false
    });   
    // Realizamos un mapeo en los objetos de asesoría 
    this.all_consultations?.map((con: Consultation) => {
      // Si la asesoría tiene un estado inactivo ignorar 
      if(!con.isActive)
        return;
      
      // Sí la asesoría está activa agregamos el marcador de color verde 
      if(con.isActive){
        const mark = new mapboxgl.Marker({
          draggable: false,
          color: this.getRandomColor(),
          
        })
        .setLngLat([parseFloat(con.map_longitud), parseFloat(con.map_latitud)])
        .addTo(this.map);
      }
      // Sí la asesoría está inactiva agregamos el marcador de color rojo
      if(!con.isActive){
        const mark = new mapboxgl.Marker({
          draggable: false,
          color: '#FF0000'
        })
        .setLngLat([parseFloat(con.map_longitud), parseFloat(con.map_latitud)])
        .addTo(this.map);
      }
    });
  }

  animateRotation() {
    const animate = () => {
      this.rotationAngle += 0.1; // Velocidad de rotación (ajusta según lo desees)
      if (this.rotationAngle >= 360) {
        this.rotationAngle = 0;
      }

      // Mueve la cámara alrededor del punto específico y rota el mapa
      this.map.jumpTo({
        center: [-103.325885, 20.657269], // Coordenadas del punto sobre el cual girar
        bearing: this.rotationAngle // Ángulo de rotación
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  // Generar una color aleatorio para los marcadores 
  getRandomColor(): any{
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++){
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}