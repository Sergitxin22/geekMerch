import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  formReg: FormGroup;
  showPassword: boolean = false;

  image: any;

  constructor(private sanitizer: DomSanitizer, private authService: AuthService) {
    this.formReg = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }
  ngOnInit(): void {
    this.image = this.sanitizer.bypassSecurityTrustUrl(
      'https://d19m59y37dris4.cloudfront.net/varkala/2-1/img/product/category-women.jpg'
    );
  }

  onSubmit() {
    this.authService
      .register(this.formReg.value)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(this.formReg.value);
        error.code === 'auth/email-already-in-use' ? console.log('ya existe') : null;
      });
  }

  logout() {
    this.authService.logout();
  }
}
