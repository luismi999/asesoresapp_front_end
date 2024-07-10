import { Component } from '@angular/core';

// Modelos 
import { Join } from 'src/app/model/join.model';
import { Consultation } from 'src/app/model/consultation.model';
import { User } from 'src/app/model/user.model';

// Servicios 
import { UsersService } from 'src/app/services/users.service';
import { ConsultationsService } from 'src/app/services/consultations.service';

@Component({
  selector: 'app-chart-advisor',
  templateUrl: './chart-advisor.component.html',
  styleUrls: ['./chart-advisor.component.css']
})
export class ChartAdvisorComponent {

  // Propiedades 
  user              !: User;
  data_chart_line   : any;
  options_chart_line: any;
  consultations     : Consultation[] = [];
  joins             : Join[] = [];

  months_inProgress_joins: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
  months_inLimbo_joins   : number[] = [0,0,0,0,0,0,0,0,0,0,0,0];
  months_finished_joins: number[] = [0,0,0,0,0,0,0,0,0,0,0,0];

  // Banderas 
  flag_loading: boolean = false;

  // Constructor 
  constructor( 
    private usersService        : UsersService,
    private consultationsService: ConsultationsService ){}

  // Inicializado 
  ngOnInit(): void {}

  // Inicializamos el componente 
  initComponent(uuid_user: string): void{
    this.findUser(uuid_user);
  }

  // Buscamos el usuario 
  findUser(uuid_user: string): void{
    // Consultamos al servicio de USERS 
    this.usersService.findOne(uuid_user)
    .subscribe({
      next: (resp: User) => {
        // Guardamos la respuesta en una variable 
        this.user = resp;
        // Buscamos las asesorías creadas 
        this.findAllConsultationsByUser();
      },error: (error) => {
        // Respuesta 
        console.log(error.error.message);
      }
    });
  }

  // Buscamos todas mis asesorías creadas
  findAllConsultationsByUser(): void{
    // Bandera 
    this.flag_loading = true;
    // Reiniciamos la data 
    this.resetData();
    // Consultamos al servicio de CONSULTATIONS
    this.consultationsService.findAllByUser(this.user.uuid)
    .subscribe({
      next: (resp: Consultation[]) => {
        // Guardamos la respuesta en una variable 
        this.consultations = resp;
        // Obtenemos los joins de cada asesoría 
        this.getJoinsByMyConsultations();
        // Inicializamos la gráfica 
        this.initChartLine();
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

  // reiniciamos la data 
  resetData(): void{
    this.months_inProgress_joins = [0,0,0,0,0,0,0,0,0,0,0,0];
    this.months_inLimbo_joins    = [0,0,0,0,0,0,0,0,0,0,0,0];
    this.months_finished_joins = [0,0,0,0,0,0,0,0,0,0,0,0];
  }

  // Obtener solo el mes de cada uno de los joins 
  getJoinsByMyConsultations(): void{
    // Reiniciamos los joins 
    this.joins = [];
    // Creamos un mapeado para obtener los joins de cada asesoría 
    this.consultations?.map((con: Consultation) => {
      // Creamos un mapeo de cada join de cada asesoría 
      con.joins.map((join: Join) => {
        // Ingresamos el join en nuestra variable de joins 
        this.joins?.push(join);
      });
    });
    // Sumamos los meses a los que pertenecen los join 
    this.getMonthsJoins();
  }

  // Obtenemos los meses de los joins 
  getMonthsJoins(): void{
    // Creamos los meses 
    const months: number[] = [1,2,3,4,5,6,7,8,9,10,11,12];
    // Creamos un mapeo para cada join 
    this.joins.map((join: Join) => {
      // Creamos un FOR para cada mes del arreglo de months 
      for (let i = 0; i < months.length; i++) {
        // Si el estado es activo lo asignamos al mes correspondiente 
        if(join.step == 'inProgress' && join.date_creation.split('/')[1] == `${i+1}`){
          // Incrementamos el mes correspondiente 
          this.months_inProgress_joins[i] = this.months_inProgress_joins[i] + 1;
        }
        // Si el estado es limbo lo asignamos al mes correspondiente 
        else if(join.step == 'inLimbo' && join.date_creation.split('/')[1] == `${i+1}`){
          // Incrementamos el mes correspondiente 
          this.months_inLimbo_joins[i] = this.months_inLimbo_joins[i] + 1;
        }
        // Si el estado es inactivo lo asignamos al mes correspondiente 
        else if(join.step == 'finished' && join.date_creation.split('/')[1] == `${i+1}`){
          // Incrementamos el mes correspondiente 
          this.months_finished_joins[i] = this.months_finished_joins[i] + 1;
        }
      }
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - Chart - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Inicializar la gráfica de linea 
  initChartLine(): void{
    // Configuración de la gráfica
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    // Creamos la data de la gráfica 
    this.data_chart_line = {
      labels: ['Enero','Febrero','Marzo','Abril','Mayo', 'Junio', 'Julio','Agosto','Septiembre','Octubre', 'Noviembre', 'Diciembre'],
      datasets: [
        {
            label: 'Joins Inprogress',
            data: [this.months_inProgress_joins[0], this.months_inProgress_joins[1], this.months_inProgress_joins[2], this.months_inProgress_joins[3], this.months_inProgress_joins[4], this.months_inProgress_joins[5], this.months_inProgress_joins[6], this.months_inProgress_joins[7], this.months_inProgress_joins[8], this.months_inProgress_joins[9], this.months_inProgress_joins[10], this.months_inProgress_joins[11]],
            fill: false,
            borderColor: documentStyle.getPropertyValue('--green-500'),
            tension: 0.4
        },
        {
          label: 'Joins InLimbo',
          data: [this.months_inLimbo_joins[0], this.months_inLimbo_joins[1], this.months_inLimbo_joins[2], this.months_inLimbo_joins[3], this.months_inLimbo_joins[4], this.months_inLimbo_joins[5], this.months_inLimbo_joins[6], this.months_inLimbo_joins[7], this.months_inLimbo_joins[8], this.months_inLimbo_joins[9], this.months_inLimbo_joins[10], this.months_inLimbo_joins[11]],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--yellow-500'),
          tension: 0.4
        },
        {
          label: 'Joins finished',
          data: [this.months_finished_joins[0], this.months_finished_joins[1], this.months_finished_joins[2], this.months_finished_joins[3], this.months_finished_joins[4], this.months_finished_joins[5], this.months_finished_joins[6], this.months_finished_joins[7], this.months_finished_joins[8], this.months_finished_joins[9], this.months_finished_joins[10], this.months_finished_joins[11]],
          fill: false,
          borderColor: documentStyle.getPropertyValue('--red-500'),
          tension: 0.4
        }
      ]
    };

    // Creamos las opciones de la gráfica 
    this.options_chart_line = {
        maintainAspectRatio: false,
        aspectRatio: 0.9,
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
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            },
        }
    };
  }
}