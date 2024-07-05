import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-read-excel',
  templateUrl: './read-excel.component.html',
  styleUrls: ['./read-excel.component.css']
})
export class ReadExcelComponent {

  // Propiedades 
  private headers: string[] = [
    "marca_temporal",
    "direccion",
    "nombre",
    "materia",
    "asistencias",
    "trabajos",
    "calificación",
    "desempeño",
    "comentarios"
  ];

  alumnosArray: any[] = [];

  // Constructor
  constructor(){}

  // Función para manejar la carga de archivos 
  handleFileInput(event: any){

    this.alumnosArray = [];

    const file = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, { type: 'binary' });
  
      // Obtener la primera hoja del libro de trabajo
      const sheetName = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
  
      // Convertir la hoja de trabajo a un array de objetos
      this.alumnosArray = XLSX.utils.sheet_to_json(worksheet,{
        raw: true,
        header: this.headers,
        range: 1
      });

      // Obtenemos solo los datos que nos interesan 
      
    };
    reader.readAsBinaryString(file);
  }
}
