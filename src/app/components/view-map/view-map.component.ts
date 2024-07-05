import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';

// Mapbox 
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-view-map',
  templateUrl: './view-map.component.html',
  styleUrls: ['./view-map.component.css']
})
export class ViewMapComponent implements OnInit {

  // Entrada 
  @Input('consultation') consultation!: Consultation;
  @Input('flag') flag!: boolean;
  // Salidas 
  @Output() flag_response = new EventEmitter<boolean>();

  // Propiedades 
  map !: mapboxgl.Map;
  mark!: mapboxgl.Marker;


  // constructor 
  constructor(){}

  // Inicializado
  ngOnInit(): void {
  }
  
  // Inicializamos el componente 
  initComponent(consultation: Consultation): void{
     // Inicializamos el mapa 
     setTimeout(() => {
      this.initMap(consultation);
    }, 200);
  }

  // Iniciar mapa 
  initMap(consultation: Consultation){
    // API KEY
    (mapboxgl as any).accessToken = import.meta.env.NG_APP_MAPBOX_KEY;
    // Creamos el mapa
    this.map = new mapboxgl.Map({
      container: 'map',
      style: `${import.meta.env.NG_APP_MAPBOX_STYLE}`,
      center: [parseFloat(consultation.map_longitud), parseFloat(consultation.map_latitud)],
      zoom: 10,
    });
    // Centrar el mapa
    this.map.flyTo({
      center: [parseFloat(consultation.map_longitud), parseFloat(consultation.map_latitud)],
      zoom: 18
    });
    // Colocamos el botón para fullscreen
    this.map.addControl(new mapboxgl.FullscreenControl());
    // Colocamos el botón de geolocalización
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
      draggable: false,
      color: "#C70039"
    })
    .setLngLat([parseFloat(consultation.map_longitud), parseFloat(consultation.map_latitud)])
    .addTo(this.map);
  }

  // Cerrar modal 
  closeModal(): void{
    this.flag_response.emit(false);
  }
}