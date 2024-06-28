import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Modelos 
import { Join } from '../model/join.model';
import { Observable } from 'rxjs';
import { UpdateJoinResponse } from '../model/updateJoinResponse.interface';

// Interfaces 
import { CreateJoin } from '../model/createJoin.interface';
import { CreateJoinResponse } from '../model/createJoinResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class JoinsService {

  // Propiedades
  private base_url: string  = `${import.meta.env.NG_APP_API}/joins`;
  grades?: number[];

  // Constructor
  constructor(private http: HttpClient) { 
    this.grades = [1,2,3,4,5,6,7,8,9,10];
  }

  // Retornamos las calificaciones
  getGrades(){
    return this.grades;
  }

  // Crear un join
  create(data: CreateJoin): Observable<CreateJoinResponse>{
    //  Creando petición http
     return this.http.post<CreateJoinResponse>(this.base_url,data);
  }

  // Buscar por usuario || asesoría
  findOne(uuid: string): Observable<Join[]>{
    // Petición al backend 
    return this.http.get<Join[]>(`${this.base_url}/${uuid}`);
  }

  // Buscar todos los joins por asesoría 
  findAllByConsultation(uuid: string): Observable<Join[]>{
    // Petición al backend 
    return this.http.get<Join[]>(`${this.base_url}/consultation/${uuid}`);
  }

  // Buscar todos los joins por asesoría 
  findAllByUser(uuid: string): Observable<Join[]>{
    // Petición al backend 
    return this.http.get<Join[]>(`${this.base_url}/user/${uuid}`);
  }

  // Actualizamos el join para que pase al paso de isLimbo
  updateJoin(uuid: string): Observable<UpdateJoinResponse>{
    // Creamos la variable del status 
    const step: string = "inLimbo";
    // Petición al backend
    return this.http.patch<UpdateJoinResponse>(`${this.base_url}/${uuid}`,{step});
  }

  // Actualizamos el join
  updateJoinGrade(uuid: string, data: any): Observable<UpdateJoinResponse>{
    // Creamos nuestra variable de comentario y calificación
    let{ grade, comment} = data;
    // Creamos la variable de step y de isActive (Recordemos que cunado un asesoramiento es calificado este debe pasar a isActive = false y de step isLimbo a isFinished)
    const isActive: boolean = false;
    const step    : string = "finished" 
    // Convertimos a numero la calificación
    grade = parseInt(grade);
    // Petición al backend
    return this.http.patch<UpdateJoinResponse>(`${this.base_url}/${uuid}`,{grade, comment, isActive, step});
  }
}
