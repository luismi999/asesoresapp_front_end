import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';

// Servicios 
import { ConsultationsService } from 'src/app/services/consultations.service';

@Component({
  selector: 'app-subject-chart',
  templateUrl: './subject-chart.component.html',
  styleUrls: ['./subject-chart.component.css']
})
export class SubjectChartComponent implements OnInit, OnDestroy {

  // Propiedades
  data         : any;
  options      : any;
  consultations: Consultation[] = [];
  subjects     : string[] = [];
  joinsCount   : number[] = [];
  ActiveConsultationsCount: number[] = [];

  // Suscripciones 
  sub_find_all_consultations?: Subscription;

  // Constructor 
  constructor(private consultationsService: ConsultationsService){}

  // Inicializado de componente
  ngOnInit() {
    this.getAllConsultations();
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_find_all_consultations?.unsubscribe();
  }

  // Buscar usuarios 
  getAllConsultations(){
    // Reiniciamos las cátedras 
    this.subjects = [];
    // Reiniciamos las asesorías 
    this.ActiveConsultationsCount = [];
    // Reiniciamos los asesoramientos
    this.joinsCount = [];
    // Consultamos el servicio de CONSULTATIONS 
    this.sub_find_all_consultations = this.consultationsService.findAll()
    .subscribe({
      next: (resp: Consultation[]) => {

        // Mapeamos la respuesta (SOLO PARA LLENAR NUESTRO ARREGLO DE CÁTEDRAS)
        resp.map((consultation: Consultation) => {
          // Sí nuestro arreglo de cátedras no incluye el nombre de la cátedra loa agregamos 
          if(!this.subjects.includes(consultation.subject.name)){
            this.subjects.push(consultation.subject.name);
          }
        });

        // Inicializamos las cuentas 
        for (let index = 0; index < this.subjects.length; index++) {
          this.ActiveConsultationsCount[index] = 0;
          this.joinsCount[index] = 0;
        }

        // Mapeamos la respuesta  (SOLO PARA LLENAR NUESTRO ARREGLO DE CONTEO POR CÁTEDRA)
        resp.map((consultation: Consultation) => {
          // Sí nuestro arreglo de cátedras no incluye el nombre de la cátedra loa agregamos 
          if(this.subjects.includes(consultation.subject.name)){
            this.ActiveConsultationsCount[this.subjects.indexOf(consultation.subject.name)]++;
            this.joinsCount[this.subjects.indexOf(consultation.subject.name)] += consultation.joins.length;
          }
        });
        
        // Iniciamos la gráfica 
        this.initChartConsultations(this.subjects, this.ActiveConsultationsCount, this.joinsCount);
      },
      error: (error) => {
        // Respuesta del backend 
        console.log(error.error.message);
      }
    });
  }

  // Inicializado de gráfica 
  initChartConsultations(subjects: string[], consultationsCount: number[], joinsCount: number[]){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.data = {
        labels: subjects,
        datasets: [
            {
                label: 'Numero de asesorías',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: consultationsCount
            },
            {
              label: 'Numero de asesoramientos',
              backgroundColor: documentStyle.getPropertyValue('--yellow-500'),
              borderColor: documentStyle.getPropertyValue('--yellow-500'),
              data: joinsCount
          }
        ]
    };

    // Opciones de configuración 
    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
            labels: {
                color: textColor
            }
        }
      },
      scales: {
        x: {
            ticks: {
                color: textColorSecondary,
                font: {
                    weight: 500
                }
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        }
      }
    };
  }
}