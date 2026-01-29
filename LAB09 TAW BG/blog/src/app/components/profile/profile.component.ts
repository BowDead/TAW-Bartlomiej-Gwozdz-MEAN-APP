import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserProfile } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | null = null;
  isEditMode = false;
  editForm = {
    name: '',
    email: ''
  };
  loading = true;
  errorMessage = '';
  successMessage = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !currentUser.userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.userService.getUserProfile(currentUser.userId).subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.editForm.name = profile.name;
        this.editForm.email = profile.email;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Nie udało się załadować profilu użytkownika';
        this.loading = false;
      }
    });
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    this.errorMessage = '';
    this.successMessage = '';
    
    if (!this.isEditMode && this.userProfile) {
      // Reset form when cancelling
      this.editForm.name = this.userProfile.name;
      this.editForm.email = this.userProfile.email;
    }
  }

  saveProfile(): void {
    const currentUser = this.authService.currentUser;
    if (!currentUser || !currentUser.userId) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.userService.updateUserProfile(currentUser.userId, this.editForm).subscribe({
      next: (response) => {
        this.successMessage = 'Profil został zaktualizowany pomyślnie';
        this.isEditMode = false;
        this.loadUserProfile();
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Nie udało się zaktualizować profilu';
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
