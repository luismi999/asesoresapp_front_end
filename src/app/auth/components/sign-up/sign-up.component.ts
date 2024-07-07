import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// Servicios 
import { UsersService } from '../../../services/users.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SignUpResponse } from 'src/app/model/signUpResponse.interface';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  providers: [ MessageService ]
})
export class SignUpComponent {

  // Inputs y outputs del componente
  @Input() flag_create_user: boolean = false;
  @Output() flag_response = new EventEmitter<boolean>();

  // Propiedades 
  form        !: FormGroup;

  // Banderas 
  flag_loading: boolean = false;

  // Suscripciones 
  sub_user_create_user?: Subscription;

  // Constructor 
  constructor( 
    private fb            : FormBuilder,
    private messageService: MessageService,
    private usersService  : UsersService ){}

  // Inicializado 
  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.sub_user_create_user?.unsubscribe();
  }

  // Inicializar formulario para la creación de un nuevo usuario
  initForm(): void{
    this.form = this.fb.group({
      institutional_code : ['200000001',[Validators.required]],
      institutional_email: ['user1@gmail.com',[Validators.required, Validators.email]],
      first_name         : ['user',[Validators.required, Validators.minLength(3)]],
      last_name          : ['user',[Validators.required, Validators.minLength(3)]],
      cellphone_number   : ['3333333333',[Validators.required, Validators.minLength(10)]],
      role               : ['student',[Validators.required]],
      password  : ['11111111',[Validators.required, Validators.minLength(8)]],
      password2 : ['11111111',[Validators.required, Validators.minLength(8)]]
    },{
      validators: [this.samePasswords('password', 'password2')] 
    });
  }

  // Validar contraseñas
  samePasswords(pass1: string, pass2: string): any{
    return (formGroup: FormGroup) => {
      // Obtenemos ambos controles
      const passControl1 = formGroup.get(pass1);
      const passControl2 = formGroup.get(pass2);
      // Sí los controles coinciden
      if(passControl1?.value == passControl2?.value){
        // No hay errores
        passControl2?.setErrors(null);
      }else{
        // Obtenemos errores
        passControl2?.setErrors({valid: false});
      }
    }
  }

  //  Manejamos los errores del formulario
  getError(controlName: string): boolean{
    // Obtenemos el control
    const control = this.form.get(controlName);
    // Sí el control es invalido
    if(control?.touched && control?.invalid)
      return true;
    return false;
  }

  // Registrar usuario nuevo
  signUp(): void{
    // Bandera 
    this.flag_loading = true;
    // Quitamos el password2 de la data del formulario para mandarlo como usuario 
    const { password2, ...rest } = this.form.value;
    // Consultamos el servicio de USERS 
    this.sub_user_create_user = this.usersService.createUser(rest).subscribe({
      next: (resp: SignUpResponse) => {
        // Respuesta
        this.messageService.add({key: 'serverResponse', severity:'info', summary: 'Info', detail: resp.msg, life: 5000});
        // Reiniciamos el formulario
        this.form.reset();
        // Reiniciamos los valores de de carrera y role en el formulario
        this.form.get('role')?.setValue('student');
        // Cerramos modal 
        this.closeModal();
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
         // Respuesta
        this.messageService.add({key: 'serverResponse', severity:'error', summary: 'Error', detail: error.error.message, life: 5000});
        // Bandera 
        this.flag_loading = false;
      }
    });
  }

  // Cerrar modal 
  closeModal(){
    this.flag_response.emit(false);
  }
}