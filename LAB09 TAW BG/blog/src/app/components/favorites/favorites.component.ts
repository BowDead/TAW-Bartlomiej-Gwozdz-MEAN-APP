import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { DataService } from '../../services/data.service';
import { FavoritesService } from '../../services/favorites.service';
import { HiddenService } from '../../services/hidden.service';

@Component({
  selector: 'favorites',
  standalone: true,
  imports: [CommonModule, BlogItemComponent],
  providers: [DataService],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  items: any[] = [];
  favoriteIds: string[] = [];
  hiddenIds: string[] = [];
  loading = true;

  constructor(
    private dataService: DataService,
    private favoritesService: FavoritesService,
    private hiddenService: HiddenService,
  ) {}

  ngOnInit(): void {
    this.refreshFavorites();
  }

  refreshFavorites(): void {
    this.favoritesService.getFavorites().subscribe(favorites => {
      this.favoriteIds = favorites;
      
      this.hiddenService.getHidden().subscribe(hidden => {
        this.hiddenIds = hidden;

        if (this.favoriteIds.length === 0) {
          this.items = [];
          this.loading = false;
          return;
        }

        this.dataService.getAll().subscribe((response: any) => {
          const data = Array.isArray(response) ? response : [];
          const favoriteSet = new Set(this.favoriteIds.map(String));
          const hiddenSet = new Set(this.hiddenIds.map(String));
          this.items = data.filter(item => item?.id && favoriteSet.has(String(item.id)) && !hiddenSet.has(String(item.id)));
          this.loading = false;
        });
      });
    });
  }

  handleFavoriteChange(): void {
    this.favoritesService.getFavorites().subscribe(favorites => {
      this.favoriteIds = favorites;
      
      this.hiddenService.getHidden().subscribe(hidden => {
        this.hiddenIds = hidden;
        const favoriteSet = new Set(this.favoriteIds.map(String));
        const hiddenSet = new Set(this.hiddenIds.map(String));
        this.items = this.items.filter(item => item?.id && favoriteSet.has(String(item.id)) && !hiddenSet.has(String(item.id)));
      });
    });
  }

  handleHiddenChange(id: string): void {
    this.items = this.items.filter(item => item?.id !== id);
  }

  handlePostDeleted(id: string): void {
    this.items = this.items.filter(item => item?.id !== id);
    this.favoriteIds = this.favoriteIds.filter(fId => fId !== id);
    this.favoritesService.removeFavorite(id).subscribe();
  }

  trackById(_: number, item: any): string | undefined {
    return item?.id;
  }
}
