import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Comment {
  _id?: string;
  postId: string;
  author: string;
  authorId?: string;
  content: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = 'http://localhost:3100/api/comments';

  constructor(private http: HttpClient) { }

  getCommentsByPostId(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${postId}`);
  }

  addComment(postId: string, author: string, content: string, authorId?: string): Observable<Comment> {
    const commentData = {
      postId,
      author,
      content,
      authorId
    };
    return this.http.post<Comment>(this.apiUrl, commentData);
  }

  deleteComment(commentId: string, userId?: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${commentId}`, {
      body: { userId }
    });
  }

  getAllComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(this.apiUrl);
  }
}
