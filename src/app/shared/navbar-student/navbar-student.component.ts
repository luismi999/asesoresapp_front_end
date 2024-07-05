import { Component } from '@angular/core';

// Modelos
import { User } from 'src/app/model/user.model';

// Servicios
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-student',
  templateUrl: './navbar-student.component.html',
  styleUrls: ['./navbar-student.component.css']
})
export class NavbarStudentComponent {

  // Propiedades
  public user?: User;

  // Constructor
  constructor(
    private router     : Router,
    private authService: AuthService){
    this.user = this.authService.getUser();
  }

  // Cerrar sesion
  signOut(){
    localStorage.removeItem("token");
    this.router.navigateByUrl("/auth");
  }
}
