import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

/* Servicios */
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdvisorGuard implements CanActivate {

  /* --------------------------------------------- Constructor ------------------------------------------------*/
  constructor(
    private authService: AuthService, 
    private router: Router ) {}

  /* ----------------------------------------------- Activar --------------------------------------------------*/
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // Validamos que tenga el role de asesor 
    if(localStorage.getItem('role') != "advisor"){
      this.router.navigateByUrl("/auth/signin");
    }
    return true;
  }
}