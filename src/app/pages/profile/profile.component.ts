import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// Modelo
import { User } from 'src/app/model/user.model';

// Servicio
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

// Interfaces 
import { UpdateUserResponse } from 'src/app/model/updateUserResponse.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [ MessageService ]
})
export class ProfileComponent {

  // Propiedades
  my_user           ?: User;
  my_form_for_update !: FormGroup;

  // Banderas
  flag_loading      : boolean = false;

  // Constructor
  constructor(
    private authService   : AuthService,
    private UsersService  : UsersService,
    private messageService: MessageService,
    private fb            : FormBuilder){}

  // Iniciador
  ngOnInit(): void {
    this.my_user = this.authService.getUser();
    this.initMyForm();
  }

  // Inicializamos nuestro formulario
  initMyForm(): void{
    this.my_form_for_update = this.fb.group({
      institutional_code : [this.my_user?.institutional_code,[Validators.required]],
      institutional_email: [this.my_user?.institutional_email,[Validators.required, Validators.email]],
      role               : [this.my_user?.role,[Validators.required]],
      first_name         : [this.my_user?.first_name,[Validators.required, Validators.minLength(3)]],
      last_name          : [this.my_user?.last_name,[Validators.required, Validators.minLength(3)]],
      cellphone_number   : [this.my_user?.cellphone_number,[Validators.required]],
    });

    // Deshabilitamos los inputs delicados  
    this.my_form_for_update.get('institutional_code')?.disable();
    this.my_form_for_update.get('role')?.disable();
  }

  //  Manejamos los errores del formulario
   getError(controlName: string): boolean{
    // Obtenemos el control
    const control = this.my_form_for_update.get(controlName);
    // Sí el control es invalido
    if(control?.touched && control?.invalid)
      return true;
    return false;
  }

  // Actualizar usuario
  updateUser(): void{
    // Bandera 
    this.flag_loading = true;
    // Convertir el teléfono a un numero 
    this.my_form_for_update.get('cellphone_number')?.setValue(parseInt(this.my_form_for_update.get('cellphone_number')?.value));
    // Convertimos la data 
    this.my_form_for_update.get('first_name')?.setValue(this.my_form_for_update.get('first_name')?.value.toLowerCase());
    this.my_form_for_update.get('last_name')?.setValue(this.my_form_for_update.get('last_name')?.value.toLowerCase());
    this.my_form_for_update.get('institutional_email')?.setValue(this.my_form_for_update.get('institutional_email')?.value.toLowerCase());
    // Realizamos la petición a nuestro servicio
    this.UsersService.update(this.my_user?.uuid || '', this.my_form_for_update.value)
    .subscribe({
      next: (resp: UpdateUserResponse) => {
        // Respuesta del servicio
        this.messageService.add({ key: 'serverResponse', severity:'success', summary: 'Success',detail: resp.msg, life: 5000 });
        // Bandera 
        this.flag_loading = false;
      },
      error: (error) => {
        // Respuesta del servicio
        this.messageService.add({ key: 'serverResponse', severity:'error', summary: 'Error',detail: error.error.message, life: 5000 });
        // Bandera 
        this.flag_loading = false;
      }
    });
  }
}