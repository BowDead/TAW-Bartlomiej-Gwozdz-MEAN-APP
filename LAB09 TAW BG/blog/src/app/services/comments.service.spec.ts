import { TestBed } from '@angular/core/testing';

import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a comment', () => {
    service.addComment(1, 'Jan Kowalski', 'Testowy komentarz');
    const comments = service.getCommentsByPostId(1);
    expect(comments.length).toBe(1);
    expect(comments[0].author).toBe('Jan Kowalski');
    expect(comments[0].content).toBe('Testowy komentarz');
  });

  it('should return comments for specific post', () => {
    service.addComment(1, 'Author 1', 'Comment for post 1');
    service.addComment(2, 'Author 2', 'Comment for post 2');
    service.addComment(1, 'Author 3', 'Another comment for post 1');

    const post1Comments = service.getCommentsByPostId(1);
    expect(post1Comments.length).toBe(2);
    
    const post2Comments = service.getCommentsByPostId(2);
    expect(post2Comments.length).toBe(1);
  });
});
