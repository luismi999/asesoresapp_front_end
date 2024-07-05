import { Component, EventEmitter, Input, Output } from '@angular/core';
import Typed from 'typed.js';

// Modelos 
import { User } from 'src/app/model/user.model';

// Interface
interface Question {
  quest   : string,
  answer  : string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  // Inputs y outputs del componente 
  @Input() flag!: boolean;
  // @Input() my_user!: any;
  @Input() instructions!: Question[];
  @Output() flag_response = new EventEmitter<boolean>();

  // Propiedades generales 
  typed    ?: Typed;
  text     : string = '';

  // Constructor 
  constructor(){}

  // Inicializado 
  ngOnInit(): void {

    // setTimeout(() => {
    //   this.SayWelcome(this.my_user!);
    // }, 500);
  }

  // Destructor 
  ngOnDestroy(): void {
    if (this.typed) {
      this.typed.destroy();
    }
  }

  // Inicializamos el componente 
  initComponent(): void{
    // this.SayWelcome(this.my_user);
  }

  // Inicializamos el chat 
  initTyped(text: string): void{
    // Configuración de Typed.js
    const options: any = {
     strings: [text],
     typeSpeed: 20,
     backSpeed: 30,
     showCursor: true,
     cursorChar: '|',
     cursorPos: 'end'
   };
   // Crear una instancia de Typed
   this.typed = new Typed('#miTexto', options);
 }

  // Decir la bienvenida 
  SayWelcome(user: User): void{
    this.text = 
    `<strong>Astro: </strong> Hola ${user.first_name.toUpperCase()} bienvenido a la plataforma de AsesoresApp, mi nombre es ASTRO y seré tu GUÍA.`;
    this.initTyped(this.text);
  }

  // Hace una pregunta 
  makeQuestion(event: any): void{
    // Obtenemos el valor de nuestra pregunta 
    const textEvent = event.target.value;
    // Destruimos el objeto typed 
    if (this.typed)
      this.typed.destroy();
    // Inicializamos el chat 
    this.initTyped(textEvent);
  }

  // Cerrar modal 
  closeModal(): void{
    // Bandera 
    this.flag_response.emit(false);
    // Destruimos el objeto de typed 
    if (this.typed)
      this.typed.destroy();
  }
}
