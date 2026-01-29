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
    this.favoritesService.toggleFavorite(this.id).subscribe(() => {
      this.favoriteChange.emit(this.id ?? '');
      this.refreshFavoriteState();
    });
  }

  toggleHidden(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.hiddenService.toggleHidden(this.id).subscribe(() => {
      this.hiddenChange.emit(this.id ?? '');
      this.refreshHiddenState();
    });
  }

  private refreshFavoriteState(): void {
    this.favoritesService.isFavorite(this.id).subscribe(isFav => {
      this.isFavorite = isFav;
    });
  }

  private refreshHiddenState(): void {
    this.hiddenService.isHidden(this.id).subscribe(isHid => {
      this.isHidden = isHid;
    });
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
    // przypadkiem dodałem posty bez autora, więc chciałem je też móc usunąć
    if (!this.userId && this.authService.isLoggedIn()) {
      return true;
    }
    // Dodałem usunięcie posta, bo ciężko było mi używać bloga bez tego
    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      return false;
    }
    
    // userId może być stringiem lub obiektem (po populate w backendzie, ale przynajmniej pokazuje kto post stworzyl)
    const userIdToCompare = typeof this.userId === 'object' && this.userId !== null && '_id' in this.userId 
      ? (this.userId as any)._id 
      : this.userId;
    
    return currentUser.userId === userIdToCompare && this.authService.isLoggedIn();
  }

}

