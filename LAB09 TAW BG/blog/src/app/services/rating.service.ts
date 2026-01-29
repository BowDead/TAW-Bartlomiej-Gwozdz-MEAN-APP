import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface PostRating {
  ratings: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly RATINGS_KEY = 'blog_ratings';
  private ratings = new BehaviorSubject<Map<string, number[]>>(new Map());
  ratings$ = this.ratings.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadRatings();
  }

  private loadRatings(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.RATINGS_KEY);
      if (saved) {
        try {
          const ratingsObj = JSON.parse(saved);
          const ratingsMap = new Map<string, number[]>(Object.entries(ratingsObj));
          this.ratings.next(ratingsMap);
        } catch (e) {
          console.error('Error loading ratings:', e);
        }
      }
    }
  }

  private saveRatings(): void {
    if (isPlatformBrowser(this.platformId)) {
      const ratingsObj = Object.fromEntries(this.ratings.value);
      localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratingsObj));
    }
  }

  addRating(postId: string, rating: number): void {
    const currentRatings = this.ratings.value;
    if (!currentRatings.has(postId)) {
      currentRatings.set(postId, []);
    }
    const postRatings = currentRatings.get(postId)!;
    postRatings.push(rating);
    this.ratings.next(new Map(currentRatings));
    this.saveRatings();
  }

  getAverageRating(postId: string): number {
    const postRatings = this.ratings.value.get(postId);
    if (!postRatings || postRatings.length === 0) return 0;
    const sum = postRatings.reduce((a, b) => a + b, 0);
    return sum / postRatings.length;
  }

  getVotesCount(postId: string): number {
    const postRatings = this.ratings.value.get(postId);
    return postRatings ? postRatings.length : 0;
  }

  getUserRating(postId: string): number {
    const postRatings = this.ratings.value.get(postId);
    if (!postRatings || postRatings.length === 0) return 0;
    return postRatings[postRatings.length - 1];
  }
}
