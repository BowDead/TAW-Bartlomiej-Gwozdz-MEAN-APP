import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
 
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials = {
	login: '',
	password: ''
  };
  loginError = false;
 
  constructor(
	private authService: AuthService,
	private router: Router
  ) { }
 
  signIn() {
	this.loginError = false;
    this.authService.authenticate(this.credentials).subscribe({
  	next: (result) => {
    	if (result) {
      	this.router.navigate(['/']);
    	} else {
      	this.loginError = true;
    	}
  	},
  	error: () => {
    	this.loginError = true;
  	}
	});
  }
}

