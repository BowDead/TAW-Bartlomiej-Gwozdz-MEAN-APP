import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BlogItemImageComponent} from "../blog-item-image/blog-item-image.component";
import {BlogItemTextComponent} from "../blog-item-text/blog-item-text.component";
import {FavoritesService} from "../../services/favorites.service";
import { HiddenService } from "../../services/hidden.service";
import { RatingComponent } from '../../shared/rating/rating.component';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { SummaryPipe } from '../../pipes/summary.pipe';

@Component({
  selector: 'blog-item',
  standalone: true,
  imports: [CommonModule, BlogItemImageComponent, BlogItemTextComponent, RatingComponent, SummaryPipe],
  templateUrl: './blog-item.component.html',
  styleUrl: './blog-item.component.scss'
})
export class BlogItemComponent implements OnChanges {
  @Input() image?: string;
  @Input() text?: string;
  @Input() id?: string;
  @Input() title?: string;
  @Input() userId?: string;

  @Output() favoriteChange = new EventEmitter<string>();
  @Output() hiddenChange = new EventEmitter<string>();
  @Output() postDeleted = new EventEmitter<string>();

  isFavorite = false;
  isHidden = false;

  constructor(
    private favoritesService: FavoritesService,
    private hiddenService: HiddenService,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    this.refreshFavoriteState();
    this.refreshHiddenState();
  }

  toggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.id);
    this.favoriteChange.emit(this.id ?? '');
    this.refreshFavoriteState();
  }

  toggleHidden(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hiddenService.toggleHidden(this.id);
    this.hiddenChange.emit(this.id ?? '');
    this.refreshHiddenState();
  }

  private refreshFavoriteState(): void {
    this.isFavorite = this.favoritesService.isFavorite(this.id);
  }

  private refreshHiddenState(): void {
    this.isHidden = this.hiddenService.isHidden(this.id);
  }

  deletePost(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('Na pewno chcesz usunąć ten post?')) {
      this.dataService.deletePost(this.id ?? '').subscribe({
        next: () => {
          this.postDeleted.emit(this.id ?? '');
        },
        error: (error) => {
          console.error('Błąd podczas usuwania posta:', error);
          alert('Nie udało się usunąć posta');
        }
      });
    }
  }

  isPostOwner(): boolean {
    // Jeśli post nie ma autora, każdy zalogowany użytkownik może go usunąć
    if (!this.userId && this.authService.isLoggedIn()) {
      return true;
    }
    // Jeśli post ma autora, tylko autor może go usunąć
    const currentUser = this.authService.currentUser;
    return currentUser && currentUser.userId === this.userId && this.authService.isLoggedIn();
  }

}

