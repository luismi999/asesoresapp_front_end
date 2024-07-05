import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// Modelos 
import { User } from '../model/user.model';

// Interfaces 
import { SignUpResponse } from '../model/signUpResponse.interface';
import { UpdateUserResponse } from '../model/updateUserResponse.interface';
import { DeleteUserResponse } from '../model/deleteUserResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  // Propiedades
  private base_url: string  = `${import.meta.env.NG_APP_API}/users`;

  // Constructor
  constructor(private http: HttpClient) { }

  // Crear usuario
  createUser(newUser: User): Observable<SignUpResponse> {
    // Consultamos al backend 
    return this.http.post<SignUpResponse>(this.base_url, newUser);
  }

  // Buscar todos los usuario
  findAll(): Observable<User[]>{
    // Realizamos la petición al backend 
    return this.http.get<User[]>(this.base_url);
  }

  // Buscar un usuario 
  findOne(uuid_user: string): Observable<User>{
    // realizamos la petición al backend 
    return this.http.get<User>(`${this.base_url}/${uuid_user}`);
  }

  // Actualizar usuario
  update(uuid: string, data: any): Observable<UpdateUserResponse>{
    // Realizamos la petición al backend 
    return this.http.patch<UpdateUserResponse>(`${this.base_url}/${uuid}`,data);
  }

  // Eliminar usuario 
  delete(uuid: string): Observable<DeleteUserResponse>{
    // Realizamos la petición al backend 
    return this.http.delete<DeleteUserResponse>(`${this.base_url}/${uuid}`);
  }
}
