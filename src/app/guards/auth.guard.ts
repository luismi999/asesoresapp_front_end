
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { tap } from 'rxjs';

/* Servicios */
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  /* --------------------------------------------- Constructor ------------------------------------------------*/
  constructor(
    private authService: AuthService, 
    private router: Router ) {}

  /* ----------------------------------------------- Activar --------------------------------------------------*/
  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.authService.renewToken().pipe(
      tap( (resp: any) => {
        if(!resp) {
          this.router.navigateByUrl("/auth/signin");
        }
      } )
    );
  }
}