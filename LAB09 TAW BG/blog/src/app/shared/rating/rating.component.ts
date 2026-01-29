import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent implements OnInit {
  @Input() postId!: string;
  @Input() readonly: boolean = false;

  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;
  currentRating: number = 0;
  averageRating: number = 0;
  votesCount: number = 0;

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.updateRating();
  }

  onStarHover(rating: number): void {
    if (!this.readonly) this.hoverRating = rating;
  }

  onStarClick(rating: number): void {
    if (!this.readonly) {
      this.ratingService.addRating(this.postId, rating);
      this.updateRating();
    }
  }

  private updateRating(): void {
    this.averageRating = this.ratingService.getAverageRating(this.postId);
    this.votesCount = this.ratingService.getVotesCount(this.postId);
    this.currentRating = this.ratingService.getUserRating(this.postId);
  }
}
