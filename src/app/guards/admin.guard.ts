import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  /* --------------------------------------------- Constructor ------------------------------------------------*/
  constructor(
    private authService: AuthService, 
    private router: Router ) {}

  /* ----------------------------------------------- Activar --------------------------------------------------*/
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    
    // Validamos que tenga el role de administrador
    if(localStorage.getItem('role') != "admin"){
      this.router.navigateByUrl("/auth/signin");
    }
    return true;
  }
}