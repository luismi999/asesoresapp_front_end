import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
// Modelos
import { User } from '../model/user.model';
// http
import { HttpClient } from '@angular/common/http';
// Interfaces 
import { renewTokenResponse } from '../model/renewTokenResponse.interface';
import { SignInResponse } from '../model/signInResponse.interface';
import { SignIn } from '../model/signIn.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Propiedades
  private user    ?: User;
  private base_url: string  = `${import.meta.env.NG_APP_API}/auth`;

  // Constructor
  constructor(private http: HttpClient) {}

  // Obtener el Token
  get token(){
    return localStorage.getItem('token') || '';
  }

  // Obtener Usuario
  getUser(){
    return this.user;
  }

  // Iniciar sesión
  signIn(signInData: SignIn): Observable<SignInResponse>{
    // Realizamos petición http
    return this.http.post<SignInResponse>(this.base_url,{institutional_code: signInData.institutional_code, password: signInData.password}).pipe(
      tap((resp: SignInResponse) => {
        // Desestructuramos la respuesta
        const {user, token} = resp;
        /* Guardamos el token en el local storage */
        localStorage.setItem('token',token);
        // Guardamos role del usuario en el localStorage 
        localStorage.setItem('role',user.role);
        /* Guardamos el usuario en la variable usuario */
        this.user = user;
      })
    )
  }

  // Renovar token
  renewToken(): Observable<boolean>{
    // Realizamos la petición http
    return this.http.get<renewTokenResponse>(`${this.base_url}/renew`,{
      // Mandamos el token en el header de la petición
      headers: {
        'token': this.token
      }
    }).pipe(
      map((resp: renewTokenResponse) => {
        // Desestructuramos la respuesta
        const {user, token} = resp;
        // Guardamos el token en el local storage
        localStorage.setItem('token', token);
        // Guardamos el usuario en nuestra variable usuario
        this.user = user;
        // Retornamos la respuesta 
        return true;
      }),catchError( error => of(false) )
    )
  }
}
