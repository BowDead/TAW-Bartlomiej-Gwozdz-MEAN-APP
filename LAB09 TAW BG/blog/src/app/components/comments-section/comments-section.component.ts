import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService, Comment } from '../../services/comments.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.scss'
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId!: string;
  
  comments: Comment[] = [];
  newCommentContent: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private commentsService: CommentsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.isLoading = true;
    this.commentsService.getCommentsByPostId(this.postId).subscribe({
      next: (comments) => {
        this.comments = comments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.errorMessage = 'Nie udało się załadować komentarzy';
        this.isLoading = false;
      }
    });
  }

  addComment(): void {
    if (this.newCommentContent.trim()) {
      const currentUser = this.authService.currentUser;
      const author = currentUser?.name || 'Anonim';
      const authorId = currentUser?.userId || undefined;

      this.isLoading = true;
      this.commentsService.addComment(this.postId, author, this.newCommentContent.trim(), authorId).subscribe({
        next: (comment) => {
          this.newCommentContent = '';
          this.loadComments();
        },
        error: (error) => {
          console.error('Error adding comment:', error);
          this.errorMessage = 'Nie udało się dodać komentarza';
          this.isLoading = false;
        }
      });
    }
  }

  deleteComment(commentId: string, commentAuthorId?: string): void {
    const currentUser = this.authService.currentUser;
    
    // Check if user is logged in and is the author
    if (!currentUser || (commentAuthorId && currentUser.userId !== commentAuthorId)) {
      this.errorMessage = 'Nie masz uprawnień do usunięcia tego komentarza';
      return;
    }

    if (confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
      this.isLoading = true;
      this.commentsService.deleteComment(commentId, currentUser?.userId).subscribe({
        next: () => {
          this.loadComments();
        },
        error: (error) => {
          console.error('Error deleting comment:', error);
          this.errorMessage = 'Nie udało się usunąć komentarza';
          this.isLoading = false;
        }
      });
    }
  }

  canDeleteComment(comment: Comment): boolean {
    const currentUser = this.authService.currentUser;
    if (!currentUser) return false;
    
    // User can delete if they are the author
    return comment.authorId === currentUser.userId;
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get currentUserName(): string {
    return this.authService.currentUser?.name || '';
  }
}
