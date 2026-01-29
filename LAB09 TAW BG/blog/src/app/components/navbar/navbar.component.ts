import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../shared/theme-toggle/theme-toggle.component';
 
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, ThemeToggleComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
 
  constructor(
	public authService: AuthService,
	private router: Router
  ) { }
 
  signOut() {
	this.authService.logout().subscribe({
  	next: () => {
    	this.router.navigate(['/']);
  	}
	});
  }
}

