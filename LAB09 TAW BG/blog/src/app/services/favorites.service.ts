import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly STORAGE_KEY = 'blog_favorites';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getFavorites(): string[] {
    return this.readFavorites();
  }

  isFavorite(id: string | undefined): boolean {
    if (!id) return false;
    return this.readFavorites().includes(String(id));
  }

  toggleFavorite(id: string | undefined): string[] {
    if (!id) return this.readFavorites();

    const favorites = this.readFavorites();
    const value = String(id);
    const index = favorites.indexOf(value);

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(value);
    }

    this.saveFavorites(favorites);
    return favorites;
  }

  removeFavorite(id: string | undefined): void {
    if (!id) return;

    const favorites = this.readFavorites();
    const value = String(id);
    const index = favorites.indexOf(value);

    if (index >= 0) {
      favorites.splice(index, 1);
      this.saveFavorites(favorites);
    }
  }

  private readFavorites(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveFavorites(favorites: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore quota or serialization errors
    }
  }
}
