import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class HiddenService {
  private readonly API_URL = 'http://localhost:3100/api/user';
  private readonly STORAGE_KEY = 'blog_hidden';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getHidden(): Observable<string[]> {
    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      // Na wszelki wypadek, jeśli nie jesteś zalogowany, to wczyta przykładowe ze storage, ale raczej sie to nie wydarzy, bo bez zalogowania wywala cie do home
      return of(this.readHiddenFromStorage());
    }

    return this.http.get<{ hiddenPosts: string[] }>(`${this.API_URL}/${userId}/hidden`).pipe(
      map(response => response.hiddenPosts || []),
      catchError(() => of(this.readHiddenFromStorage()))
    );
  }

  isHidden(id: string | undefined): Observable<boolean> {
    if (!id) return of(false);
    
    return this.getHidden().pipe(
      map(hidden => hidden.includes(String(id)))
    );
  }

  toggleHidden(id: string | undefined): Observable<string[]> {
    if (!id) return this.getHidden();

    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      // Fallback do localStorage
      return of(this.toggleHiddenInStorage(id));
    }

    return this.isHiddenSync(id).pipe(
      switchMap(isHidden => {
        if (isHidden) {
          return this.removeHidden(id);
        } else {
          return this.addHidden(id);
        }
      }),
      switchMap(() => this.getHidden())
    );
  }

  addHidden(id: string | undefined): Observable<any> {
    if (!id) return of(null);

    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      const hidden = this.readHiddenFromStorage();
      if (!hidden.includes(String(id))) {
        hidden.push(String(id));
        this.saveHiddenToStorage(hidden);
      }
      return of(hidden);
    }

    return this.http.post(`${this.API_URL}/${userId}/hidden/${id}`, {}).pipe(
      catchError(() => of(null))
    );
  }

  removeHidden(id: string | undefined): Observable<any> {
    if (!id) return of(null);

    const userId = this.authService.currentUser?.userId;
    
    if (!userId) {
      const hidden = this.readHiddenFromStorage();
      const index = hidden.indexOf(String(id));
      if (index >= 0) {
        hidden.splice(index, 1);
        this.saveHiddenToStorage(hidden);
      }
      return of(hidden);
    }

    return this.http.delete(`${this.API_URL}/${userId}/hidden/${id}`).pipe(
      catchError(() => of(null))
    );
  }

  private isHiddenSync(id: string): Observable<boolean> {
    return this.getHidden().pipe(
      map(hidden => hidden.includes(String(id)))
    );
  }

  private toggleHiddenInStorage(id: string): string[] {
    const hidden = this.readHiddenFromStorage();
    const value = String(id);
    const index = hidden.indexOf(value);

    if (index >= 0) {
      hidden.splice(index, 1);
    } else {
      hidden.push(value);
    }

    this.saveHiddenToStorage(hidden);
    return hidden;
  }

  private readHiddenFromStorage(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveHiddenToStorage(hidden: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(hidden));
    } catch {
      console.error('Failed to save hidden posts');
    }
  }
}
