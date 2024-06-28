import { Component, ViewChild } from '@angular/core';

// Instrucciones 
import { instruction_home } from 'src/app/instruction_chats/instructions';

// Modelos 
import { User } from 'src/app/model/user.model';

// Servicios 
import { AuthService } from '../../services/auth.service';

// Componentes hijos 
import { ChatComponent } from './../../components/chat/chat.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  @ViewChild(ChatComponent) chatComponent!: ChatComponent;

  // Propiedades generales 
  my_user?: User;

  // Propiedades para el chat 
  instructions  : any[] = instruction_home;
  flag_show_chat: boolean = false;

  // Constructor
  constructor(private authService: AuthService){}

  // Inicializado 
  ngOnInit() {
    this.my_user = this.authService.getUser();
  }

  // Mostramos el modal del chat 
  showChat(){
    // Bandera 
    this.flag_show_chat = true;
    // Iniciamos el componente 
    setTimeout(() => {
      this.chatComponent.initComponent();
    }, 100);
  }
}
