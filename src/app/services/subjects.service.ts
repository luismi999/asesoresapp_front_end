import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaces 
import { CreateSubjectResponse } from '../model/createSubjectResponse.interface';

// Modelos 
import { Subject } from '../model/subject.model';
import { DeleteSubjectResponse } from '../model/deleteSubjectResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {

  // Propiedades 
  private base_url: string  = `${import.meta.env.NG_APP_API}/subjects`;

  // Constructor 
  constructor(private http: HttpClient) {}

  // Crear cátedra 
  create(data: Subject): Observable<CreateSubjectResponse>{
    // Solicitud al backend 
    return this.http.post<CreateSubjectResponse>(this.base_url, data);
  } 

  // Buscar todas las cátedras
  findAll(): Observable<Subject[]>{
    // Realizamos petición al backend 
    return this.http.get<Subject[]>(this.base_url);
  }

  // Eliminar una cátedra 
  delete(uuid: string): Observable<DeleteSubjectResponse>{
    // Realizamos la petición al backend 
    return this.http.delete<DeleteSubjectResponse>(`${this.base_url}/${uuid}`);
  }
}