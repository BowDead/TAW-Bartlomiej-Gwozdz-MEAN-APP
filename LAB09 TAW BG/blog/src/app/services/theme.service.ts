import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'blog_theme';
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.initTheme();
  }

  private initTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.THEME_KEY);
      if (saved !== null) {
        this.setDarkMode(saved === 'dark');
      } else {
        // Detekcja preferencji systemowych
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches;
        this.setDarkMode(prefersDark);
      }
    }
  }

  toggleTheme(): void {
    this.setDarkMode(!this.darkMode.value);
  }

  private setDarkMode(isDark: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      this.darkMode.next(isDark);
      if (isDark) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    }
  }

  isDarkMode(): boolean {
    return this.darkMode.value;
  }
}
