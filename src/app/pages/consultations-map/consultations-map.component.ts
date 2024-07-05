import { Component } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

// Modelos
import { Consultation } from 'src/app/model/consultation.model';

// Servicios
import { ConsultationsService } from 'src/app/services/consultations.service';

@Component({
  selector: 'app-consultations-map',
  templateUrl: './consultations-map.component.html',
  styleUrls: ['./consultations-map.component.css']
})
export class ConsultationsMapComponent {

  // Propiedades 
  map !: mapboxgl.Map;  
  mark!: mapboxgl.Marker;

  // Propiedades 
  all_consultations     ?: Consultation[];
  active_consultations  ?: Consultation[];
  inactive_consultations?: Consultation[];

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
      center: [-103.324367, 20.656952],
      zoom: 16,
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
    // Realizamos un mapeo en los objetos de asesoría 
    this.all_consultations?.map((con: Consultation) => {
      // Si la asesoría tiene un estado inactivo ignorar 
      if(!con.isActive)
        return;
      // Creamos el objeto del popUp para los marcadores 
      const popup = new mapboxgl.Popup({ closeOnClick: true,  })
        .setLngLat([parseFloat(con.map_longitud), parseFloat(con.map_latitud)])
        .setMaxWidth('300px')
        .setHTML(`
          <div class="row p-3" style="width: 300px">
            <div class="col card">
              <div class="card-body">
                <h5 class="mb-0 text-table-font"><strong>Asesoramiento</strong></h5>
                <h6 class="text-muted text-table-font mt-0">${con.subject.name}</h6>
                <hr>
                <h6 class="text-table-font"><strong>Fecha de creación:</strong><br>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-egg-cracked" width="20" height="20" viewBox="0 0 30 30" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M19 14.083c0 4.154 -2.966 6.74 -7 6.917c-4.2 0 -7 -2.763 -7 -6.917c0 -5.538 3.5 -11.09 7 -11.083c3.5 .007 7 5.545 7 11.083z" />
                      <path d="M12 3l-1.5 5l3.5 2.5l-2 3.5" />
                    </svg>
                  </span>
                  ${con.date_creation}
                </h6>
                <h6 class="text-table-font"><strong>Día:</strong><br>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal" viewBox="0 0 16 18">
                      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
                      <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
                    </svg>
                  </span>
                  ${con.day}
                </h6>
                <h6 class="text-table-font"><strong>Horario: </strong><br>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 18">
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                    </svg>
                  </span>
                  ${con.start}:00 - ${con.end}:00
                </h6>
                <h6 class="text-table-font"><strong>Asesorados: </strong><br>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people" viewBox="0 0 16 18">
                    <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1L7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002-.014.002zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a6 6 0 0 0-1.23-.247A7 7 0 0 0 5 9c-4 0-5 3-5 4q0 1 1 1h4.216A2.24 2.24 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.5 5.5 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4"/>
                  </svg>
                  ${con.joins?.length}
                </h6>
                <h6 class="text-table-font"><strong>Asesor: </strong><br>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person" viewBox="0 0 16 18">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                  </svg>
                  ${con.user?.first_name} ${con.user?.last_name}
                </h6>
              </div>
            </div>
          </div>
        `)
        .addTo(this.map);
      // Sí la asesoría está activa agregamos el marcador de color verde 
      if(con.isActive){
        const mark = new mapboxgl.Marker({
          draggable: false,
          color: this.getRandomColor(),
          
        })
        .setPopup(popup)
        .setLngLat([parseFloat(con.map_longitud), parseFloat(con.map_latitud)])
        .addTo(this.map);
      }
      // Sí la asesoría está inactiva agregamos el marcador de color rojo
      if(!con.isActive){
        const mark = new mapboxgl.Marker({
          draggable: false,
          color: '#FF0000'
        })
        .setPopup(popup)
        .setLngLat([parseFloat(con.map_longitud), parseFloat(con.map_latitud)])
        .addTo(this.map);
      }
    });
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
