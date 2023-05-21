import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
} from '@angular/fire/auth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  URL = 'https://localhost:7056';

  constructor(private auth: Auth, private http: HttpClient) {}

  public register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  public persistirUsuario(datos: any) {
    console.log(datos);

    return this.http.post(`https://localhost:7056/api/Usuarios`, datos);
  }

  public logout() {
    return signOut(this.auth);
  }
}
