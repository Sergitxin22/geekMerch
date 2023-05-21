import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formReg: FormGroup;
  showPassword: boolean = false;

  constructor(private authService: AuthService) {
    this.formReg = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit() {
    this.authService
      .login(this.formReg.value)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(this.formReg.value);
        console.log(error.code);
        if (error.code === 'auth/wrong-password') console.log('contraseña incorrecta');
        if (error.code === 'auth/user-not-found') console.log('usuario no existe');
        if (error.code === 'auth/invalid-email') console.log('formato de email incorrecto');
      });
  }

  iniciarSesionGoogle() {
    this.authService
      .loginWithGoogle()
      .then(response => {
        console.log(response);
        console.log('Usuario', response.user);
        this.authService
          .persistirUsuario({ Id: response.user.uid, Nombre: response.user.displayName })
          .subscribe(e => console.log(e));
      })
      .catch(error => {});
  }
}
