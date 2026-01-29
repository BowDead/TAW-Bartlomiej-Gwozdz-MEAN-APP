import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class HiddenService {
  private readonly STORAGE_KEY = 'blog_hidden';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getHidden(): string[] {
    return this.readHidden();
  }

  isHidden(id: string | undefined): boolean {
    if (!id) return false;
    return this.readHidden().includes(String(id));
  }

  toggleHidden(id: string | undefined): string[] {
    if (!id) return this.readHidden();

    const hidden = this.readHidden();
    const value = String(id);
    const index = hidden.indexOf(value);

    if (index >= 0) {
      hidden.splice(index, 1);
    } else {
      hidden.push(value);
    }

    this.saveHidden(hidden);
    return hidden;
  }

  removeHidden(id: string | undefined): void {
    if (!id) return;

    const hidden = this.readHidden();
    const value = String(id);
    const index = hidden.indexOf(value);

    if (index >= 0) {
      hidden.splice(index, 1);
      this.saveHidden(hidden);
    }
  }

  private readHidden(): string[] {
    if (!isPlatformBrowser(this.platformId)) return [];

    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveHidden(hidden: string[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(hidden));
    } catch {
      console.error('Failed to save hidden posts');
    }
  }
}
