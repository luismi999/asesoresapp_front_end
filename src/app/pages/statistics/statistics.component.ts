import { Component, ViewChild } from '@angular/core';

// Modelos 
import { User } from 'src/app/model/user.model';

// Servicios
import { AuthService } from 'src/app/services/auth.service';

// Componentes hijos 
import { ChartAdvisorComponent } from 'src/app/components/chart-advisor/chart-advisor.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {

  @ViewChild(ChartAdvisorComponent) chartAdvisorComponent!: ChartAdvisorComponent;

  // Propiedades
  my_user?: User;

  // Constructor
  constructor(private authService: AuthService){}

  // Iniciador
  ngOnInit(): void {
    // Obtenemos el usuario 
    this.my_user = this.authService.getUser();
    // Creamos un setTimeOut para asegurarnos que el usuario se haya obtenido 
    setTimeout(() => {
      this.chartAdvisorComponent.initComponent(this.my_user?.uuid || '');
    }, 100);
  }
}