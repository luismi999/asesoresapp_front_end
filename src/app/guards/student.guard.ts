import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

/* Servicios */
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  /* --------------------------------------------- Constructor ------------------------------------------------*/
  constructor(
    private authService: AuthService, 
    private router: Router ) {}

  /* ----------------------------------------------- Activar --------------------------------------------------*/
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    // Validamos que tenga el role de estudiante 
    if(localStorage.getItem('role') != "student"){
      this.router.navigateByUrl("/auth/signin");
    }
    return true;
  }
}