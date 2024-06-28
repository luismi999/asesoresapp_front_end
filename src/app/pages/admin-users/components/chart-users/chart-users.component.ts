import { Component } from '@angular/core';

// Servicios 
import { UsersService } from '../../../../services/users.service';

// Modelos 
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-chart-users',
  templateUrl: './chart-users.component.html',
  styleUrls: ['./chart-users.component.css']
})
export class ChartUsersComponent {
    
  // Propiedades
  data   : any;
  options: any;
  users  : User[] = [];

  // Constructor 
  constructor(private usersService: UsersService){}

  // Inicializado de componente
  ngOnInit() {
    this.getAllUsers();
  }

  // Buscar usuarios 
  getAllUsers(){
    // Consultamos el servicio de USERS 
    this.usersService.findAll()
    .subscribe({
      next: (resp: User[]) => {
        // Creamos las variables para los usuarios de tipo ADVISOR 
        let advisorsActive  : number = 0;
        let advisorsInactive: number = 0;
        // Creamos las variables para los usuarios de tipo STUDENT 
        let studentsActive  : number = 0;
        let studentsInactive: number = 0;
        // Mapeamos la respuesta 
        resp.map((user: User) => {
          // Sí el usuario es asesor y esta activo 
          if(user.role == 'advisor' && user.isActive)
            advisorsActive++;
          // Sí el usuario es asesor y esta inactivo 
          else if(user.role == 'advisor' && !user.isActive)
            advisorsInactive++;
           // Sí el usuario es estudiante y esta activo 
          else if(user.role == 'student' && user.isActive)
            studentsActive++;
          // Sí el usuario es estudiante y esta inactivo 
          else if(user.role == 'student' && !user.isActive)
            studentsInactive++;
          // Inicializamos la gráfica con los datos obtenidos 
          this.initChartUsers(advisorsActive, advisorsInactive, studentsActive, studentsInactive);
        });
      },
      error: (error) => {
        // Respuesta del backend 
        console.log(error.error.message);
      }
    });
  }

  // Inicializado de gráfica 
  initChartUsers(advisorsActive: number, advisorsInactive: number, studentsActive: number, studentsInactive: number){
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    
    this.data = {
        labels: ['Estudiantes','Asesores'],
        datasets: [
            {
                label: 'Activos',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: [studentsActive, advisorsActive]
            },
            {
                label: 'Inactivos',
                backgroundColor: documentStyle.getPropertyValue('--red-500'),
                borderColor: documentStyle.getPropertyValue('--red-500'),
                data: [studentsInactive, advisorsInactive]
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