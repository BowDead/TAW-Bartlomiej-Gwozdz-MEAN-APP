import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss'
})
export class AddPostComponent {
  postForm: FormGroup;
  isSubmitted = false;
  showSuccessMessage = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  imageSource: 'url' | 'file' = 'url';

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      text: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]]
    });

    this.postForm.get('image')?.valueChanges.subscribe(url => {
      this.updateImagePreview(url);
    });
  }

  get f() {
    return this.postForm.controls;
  }

  updateImagePreview(url: string): void {
    if (url && this.postForm.get('image')?.valid) {
      this.imagePreview = url;
    } else {
      this.imagePreview = null;
    }
  }

  onImageSourceChange(source: 'url' | 'file'): void {
    this.imageSource = source;
    this.imagePreview = null;
    this.selectedFile = null;
    
    if (source === 'url') {
      this.postForm.get('image')?.setValidators([Validators.required, Validators.pattern(/^https?:\/\/.+/)]);
      this.postForm.get('image')?.setValue('');
    } else {
      this.postForm.get('image')?.clearValidators();
      this.postForm.get('image')?.setValue('file-upload');
    }
    this.postForm.get('image')?.updateValueAndValidity();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Czy dobry plik
      if (!file.type.startsWith('image/')) {
        alert('Proszę wybrać plik obrazu');
        return;
      }
      
      // Ograniczenie do 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert('Plik jest za duży. Maksymalny rozmiar to 5MB');
        return;
      }
      
      this.selectedFile = file;
      
      // Podgląd obrazu 
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
      
      // Zaznaczenie, czy obraz jest wybrany
      this.postForm.get('image')?.setValue('file-upload');
    }
  }

  onSubmit(): void {
    this.isSubmitted = true;

    if (this.postForm.invalid) {
      return;
    }

    // Bez pliku obrazu nie opublikujesz posta
    if (this.imageSource === 'file' && !this.selectedFile) {
      alert('Proszę wybrać plik obrazu');
      return;
    }

    const { title, text, image } = this.postForm.value;
    
    // Wysyłanie FormData gdy wybrano plik, JSON gdy URL
    if (this.imageSource === 'file' && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('text', text);
      formData.append('image', this.selectedFile);
      
      this.dataService.addPostWithFile(formData).subscribe({
        next: (response) => {
          this.showSuccessMessage = true;
          this.postForm.reset();
          this.isSubmitted = false;
          this.imagePreview = null;
          this.selectedFile = null;
          this.imageSource = 'url';

          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error adding post:', error);
          alert('Wystąpił błąd podczas dodawania posta. Spróbuj ponownie.');
        }
      });
    } else {
      // URL-based image
      const post = { title, text, image };
      this.dataService.addPost(post).subscribe({
        next: (response) => {
          this.showSuccessMessage = true;
          this.postForm.reset();
          this.isSubmitted = false;
          this.imagePreview = null;
          this.selectedFile = null;
          this.imageSource = 'url';

          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 3000);
        },
        error: (error) => {
          console.error('Error adding post:', error);
          alert('Wystąpił błąd podczas dodawania posta. Spróbuj ponownie.');
        }
      });
    }
  }
}
