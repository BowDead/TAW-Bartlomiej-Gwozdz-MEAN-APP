import {Component, Input} from '@angular/core';

@Component({
  selector: 'blog-item-image',
  imports: [],
  templateUrl: './blog-item-image.component.html',
  standalone: true,
  styleUrl: './blog-item-image.component.scss'
})
export class BlogItemImageComponent {
  @Input() image?: string;
  
  get imageUrl(): string {
    if (!this.image) return '';
    // Jeśli ścieżka zaczyna się od /images/, dodaj URL backendu
    if (this.image.startsWith('/images/')) {
      return 'http://localhost:3100' + this.image;
    }
    // W przeciwnym razie zwróć oryginalny URL
    return this.image;
  }
}
