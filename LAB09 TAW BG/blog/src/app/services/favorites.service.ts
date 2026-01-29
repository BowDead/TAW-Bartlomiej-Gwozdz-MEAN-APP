import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly API_URL = 'http://localhost:3100/api/user';
  private readonly STORAGE_KEY = 'blog_favorites';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getFavorites(): Observable<string[]> {
    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      // Fallback do localStorage jeśli użytkownik nie jest zalogowany
      return of(this.readFavoritesFromStorage());
    }

    return this.http.get<{ favoritePosts: string[] }>(`${this.API_URL}/${userId}/favorites`).pipe(
      map(response => response.favoritePosts || []),
      catchError(() => of(this.readFavoritesFromStorage()))
    );
  }

  isFavorite(id: string | undefined): Observable<boolean> {
    if (!id) return of(false);
    
    return this.getFavorites().pipe(
      map(favorites => favorites.includes(String(id)))
    );
  }

  toggleFavorite(id: string | undefined): Observable<string[]> {
    if (!id) return this.getFavorites();

    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      // Fallback do localStorage
      return of(this.toggleFavoriteInStorage(id));
    }

    return this.isFavoriteSync(id).pipe(
      switchMap(isFavorite => {
        if (isFavorite) {
          return this.removeFavorite(id);
        } else {
          return this.addFavorite(id);
        }
      }),
      switchMap(() => this.getFavorites())
    );
  }

  addFavorite(id: string | undefined): Observable<any> {
    if (!id) return of(null);

    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      const favorites = this.readFavoritesFromStorage();
      if (!favorites.includes(String(id))) {
        favorites.push(String(id));
        this.saveFavoritesToStorage(favorites);
      }
      return of(favorites);
    }

    return this.http.post(`${this.API_URL}/${userId}/favorites/${id}`, {}).pipe(
      catchError(() => of(null))
    );
  }

  removeFavorite(id: string | undefined): Observable<any> {
    if (!id) return of(null);

    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      const favorites = this.readFavoritesFromStorage();
      const index = favorites.indexOf(String(id));
      if (index >= 0) {
        favorites.splice(index, 1);
        this.saveFavoritesToStorage(favorites);
      }
      return of(favorites);
    }

    return this.http.delete(`${this.API_URL}/${userId}/favorites/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  private isFavoriteSync(id: string): Observable<boolean> {
    return this.getFavorites().pipe(
      map(favorites => favorites.includes(String(id)))
    );
  }

  private toggleFavoriteInStorage(id: string): string[] {
    const favorites = this.readFavoritesFromStorage();
    const value = String(id);
    const index = favorites.indexOf(value);

    if (index >= 0) {
      favorites.splice(index, 1);
    } else {
      favorites.push(value);
    }

    this.saveFavoritesToStorage(favorites);
    return favorites;
  }

  private readFavoritesFromStorage(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveFavoritesToStorage(favorites: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Błędy ignorujemy
    }
  }
}
