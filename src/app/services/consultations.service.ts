import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Interfaces 
import { CreateConsultation } from '../model/createConsultation.interface';
import { CreateConsultationResponse } from '../model/createConsultationResponse.interface';
import { Observable } from 'rxjs';
import { Consultation } from '../model/consultation.model';
import { UpdateConsultationResponse } from '../model/updateConsultationResponse.interface';
import { deleteConsultationResponse } from '../model/deleteConsultationResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsultationsService {

  // Propiedades
  private base_url: string  = `${import.meta.env.NG_APP_API}/consultations`;
  subjects        ?: string[];
  hours           ?: number[];
  days            ?: string[];

  // Constructor
  constructor( private http: HttpClient ) { 
    this.hours    = [7,8,9,10,11,12,13,14,15,16,17,18];
    this.days     = ["lunes","martes","miércoles","jueves","viernes","sábado"];
  }

  // Crear asesoría
  create(newConsultation: CreateConsultation): Observable<CreateConsultationResponse>{
    // Petición al backend
    return this.http.post<CreateConsultationResponse>(this.base_url || '', newConsultation);
  }

  // Buscar todas las asesorías
  findAll(): Observable<Consultation[]>{
    // Petición al backend
    return this.http.get<Consultation[]>(this.base_url || '');
  }

  // Buscar por uuid
  findOne(uuid: string): Observable<Consultation>{
    // Petición al backend
    return this.http.get<Consultation>(`${this.base_url}/${uuid}`);
  }

  // Buscamos las asesorías por usuario 
  findAllByUser(uuid: string): Observable<Consultation[]>{
    // Petición al backend
    return this.http.get<Consultation[]>(`${this.base_url}/user/${uuid}`);
  }

  // Buscamos las asesorías por cátedra  
  findAllBySubject(uuid: string): Observable<Consultation[]>{
    // Petición al backend
    return this.http.get<Consultation[]>(`${this.base_url}/subject/${uuid}`);
  }

  // Actualizar una asesoría
  update(uuid: string): Observable<UpdateConsultationResponse>{
    // Petición al backend 
    return this.http.patch<UpdateConsultationResponse>(`${this.base_url}/${uuid}`,{ isActive: false });
  }

  // Actualizar una asesoría
  updateByAdmin(uuid: string, data: any): Observable<UpdateConsultationResponse>{
    // Obtenemos el status de la data 
    const { status } = data;
    // Petición al backend 
    return this.http.patch<UpdateConsultationResponse>(`${this.base_url}/${uuid}`,{ status });
  }

  // Eliminar una asesoría 
  delete(uuid: string): Observable<deleteConsultationResponse>{
    // Petición al backend 
    return this.http.delete<deleteConsultationResponse>(`${this.base_url}/${uuid}`);
  }
}
