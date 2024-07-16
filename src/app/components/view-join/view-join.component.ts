import { Component, Input } from '@angular/core';

// Modelos 
import { Consultation } from 'src/app/model/consultation.model';
import { Join } from 'src/app/model/join.model';

@Component({
  selector: 'app-view-join',
  templateUrl: './view-join.component.html',
  styleUrls: ['./view-join.component.css']
})
export class ViewJoinComponent {

  // Entradas 
  @Input() get_join!: Join;

  // Propiedades 
  join        !: Join;
  consultation!: Consultation;

  // Banderas 
  show_flag: boolean = false;

  // Constructor 
  constructor() {}

  // Inicializar componente 
  start_component(join: Join, consultation: Consultation){
    this.join         = join;
    this.consultation = consultation;
    this.show_modal();
  }

  // Mostrar modal 
  show_modal(){
    this.show_flag = true;
  }

  // Cerrar modal 
  close_modal(){
    this.show_flag = false;
  }
}
