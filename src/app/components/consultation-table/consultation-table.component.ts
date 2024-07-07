import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConsultationsService } from '../../services/consultations.service';
import { Consultation } from 'src/app/model/consultation.model';

@Component({
  selector: 'app-consultation-table',
  templateUrl: './consultation-table.component.html',
  styleUrls: ['./consultation-table.component.css']
})
export class ConsultationTableComponent implements OnInit, OnDestroy {

  // Propiedades 
  consultations: Consultation[] = [];

  // Constructor 
  constructor(private consultationsService: ConsultationsService){}

  ngOnInit(): void {
    this.getAllConsultations();
  }

  ngOnDestroy(): void {
    
  }

  getAllConsultations(): void{
    this.consultationsService.findAll().subscribe({
      next: (consultations: Consultation[]) => {
        this.consultations = [];
        this.consultations = consultations;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

}
