import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// Servicios
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
// Interfaces 
import { SignInResponse } from 'src/app/model/signInResponse.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ MessageService ]
})
export class LoginComponent {

  // Propiedades
  form!: FormGroup;

  // Banderas 
  flag_loading         : boolean = false;
  flag_show_create_user: boolean = false;

  // Suscripciones 
  sub_auth_sign_in?: Subscription;

  // Constructor
  constructor(
    private router        : Router,
    private authService   : AuthService,
    private fb            : FormBuilder,
    private messageService: MessageService,){}

  // Inicializado
  ngOnInit(): void {
    this.initForm();
  }

  // Destructor 
  ngOnDestroy(): void {
    this.sub_auth_sign_in?.unsubscribe();
  }

  // Inicializamos nuestros formularios
  initForm(): void{
    // Creamos nuestro formulario para el inicio de sesión 
    this.form = this.fb.group({
      institutional_code: ['',[Validators.required]],
      password          : ['',[Validators.required]],
    });
  }

  // Iniciar sesión
  signIn(): void{
    // Bandera 
    this.flag_loading = true;
    // Consultamos el servicio de AUTH 
    this.sub_auth_sign_in = this.authService.signIn(this.form.value).subscribe({
      next: (resp: SignInResponse) => {
        //  Respuesta
        this.messageService.add({key: 'serverResponse', severity:'success', summary: 'Success', detail: resp.msg, life: 5000});
        // Bandera 
        this.flag_loading = false;
        // Cambiar de pagina
        setTimeout(() => {
          this.router.navigateByUrl('/home');
        },2000);
      },
      error: (error) => {
        // Respuesta
        this.messageService.add({key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000});
        // Bandera 
        this.flag_loading = false;
      }
    })
  }
}
