import { Component } from '@angular/core';

// Modelos 
import { User } from 'src/app/model/user.model';

// Servicios 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // Propiedades generales 
  my_user?: User;

  // Constructor
  constructor(private authService: AuthService){}

  // Inicializado 
  ngOnInit() {
    this.my_user = this.authService.getUser();
  }
}
